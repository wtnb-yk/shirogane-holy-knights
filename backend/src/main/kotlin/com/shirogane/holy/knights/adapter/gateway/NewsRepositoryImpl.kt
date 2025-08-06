package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.NewsRepository
import io.r2dbc.spi.Row
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class NewsRepositoryImpl(
    private val template: R2dbcEntityTemplate
) : NewsRepository {

    private val logger = LoggerFactory.getLogger(NewsRepositoryImpl::class.java)

    override suspend fun search(
        query: String?,
        categoryId: Int?,
        categoryIds: List<Int>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<News> {
        // 有効なカテゴリIDリストを取得（後方互換性対応）
        val effectiveCategoryIds = when {
            !categoryIds.isNullOrEmpty() -> categoryIds
            categoryId != null -> listOf(categoryId)
            else -> null
        }
        
        logger.info("ニュース検索: query=$query, categoryIds=$effectiveCategoryIds, startDate=$startDate, endDate=$endDate, limit=$limit, offset=$offset")
        return try {
            searchWithJoin(query, effectiveCategoryIds, startDate, endDate, limit, offset)
        } catch (e: Exception) {
            logger.error("ニュース検索エラー", e)
            emptyList()
        }
    }

    /**
     * JOINクエリを使った最適化されたニュース検索（複数カテゴリ対応）
     * 全ての検索で中間テーブルを使用
     */
    private suspend fun searchWithJoin(
        query: String?,
        categoryIds: List<Int>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<News> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
        // WHERE句の動的構築
        query?.let {
            conditions.add("(n.title LIKE :query OR n.content LIKE :query)")
            bindings["query"] = "%$it%"
        }
        
        categoryIds?.takeIf { it.isNotEmpty() }?.let { ids ->
            val placeholders = ids.mapIndexed { index, _ -> ":categoryId$index" }.joinToString(",")
            conditions.add("nnc.news_category_id IN ($placeholders)")
            ids.forEachIndexed { index, id ->
                bindings["categoryId$index"] = id
            }
        }
        
        startDate?.let {
            conditions.add("n.published_at >= :startDate")
            bindings["startDate"] = it
        }
        
        endDate?.let {
            conditions.add("n.published_at <= :endDate")
            bindings["endDate"] = it
        }
        
        val whereClause = if (conditions.isNotEmpty()) {
            "WHERE ${conditions.joinToString(" AND ")}"
        } else {
            ""
        }
        
        // 全てのクエリで news_news_categories 中間テーブルを使用
        val sql = """
            SELECT 
                n.id, n.title, n.content, n.thumbnail_url, n.external_url, n.published_at,
                COALESCE(STRING_AGG(nc.id::text, ',' ORDER BY nc.sort_order), '') as category_ids,
                COALESCE(STRING_AGG(nc.name, ',' ORDER BY nc.sort_order), '') as category_names,
                COALESCE(STRING_AGG(nc.sort_order::text, ',' ORDER BY nc.sort_order), '') as category_sort_orders
            FROM news n
            INNER JOIN news_news_categories nnc ON n.id = nnc.news_id
            INNER JOIN news_categories nc ON nnc.news_category_id = nc.id
            $whereClause
            GROUP BY n.id, n.title, n.content, n.thumbnail_url, n.external_url, n.published_at
            ORDER BY n.published_at DESC
            LIMIT :limit OFFSET :offset
        """.trimIndent()
        
        logger.info("実行SQL: $sql")
        logger.info("バインド値: $bindings")
        
        var sqlQuery = template.databaseClient.sql(sql)
        bindings.forEach { (key, value) ->
            sqlQuery = sqlQuery.bind(key, value)
        }
        sqlQuery = sqlQuery.bind("limit", limit).bind("offset", offset)
        
        return sqlQuery.map { row -> buildNewsFromRowWithMultipleCategories(row as Row) }
            .all()
            .collectList()
            .awaitSingle()
    }

    override suspend fun countBySearchCriteria(
        query: String?,
        categoryId: Int?,
        categoryIds: List<Int>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        // 有効なカテゴリIDリストを取得（後方互換性対応）
        val effectiveCategoryIds = when {
            !categoryIds.isNullOrEmpty() -> categoryIds
            categoryId != null -> listOf(categoryId)
            else -> null
        }
        
        logger.info("検索結果総数取得: query=$query, categoryIds=$effectiveCategoryIds, startDate=$startDate, endDate=$endDate")
        return try {
            val conditions = mutableListOf<String>()
            val bindings = mutableMapOf<String, Any>()
            
            query?.let {
                conditions.add("(n.title LIKE :query OR n.content LIKE :query)")
                bindings["query"] = "%$it%"
            }
            
            effectiveCategoryIds?.takeIf { it.isNotEmpty() }?.let { ids ->
                val placeholders = ids.mapIndexed { index, _ -> ":categoryId$index" }.joinToString(",")
                conditions.add("nnc.news_category_id IN ($placeholders)")
                ids.forEachIndexed { index, id ->
                    bindings["categoryId$index"] = id
                }
            }
            
            startDate?.let {
                conditions.add("n.published_at >= :startDate")
                bindings["startDate"] = it
            }
            
            endDate?.let {
                conditions.add("n.published_at <= :endDate")
                bindings["endDate"] = it
            }
            
            val whereClause = if (conditions.isNotEmpty()) {
                "WHERE ${conditions.joinToString(" AND ")}"
            } else {
                ""
            }
            
            val sql = """
                SELECT COUNT(DISTINCT n.id)
                FROM news n
                INNER JOIN news_news_categories nnc ON n.id = nnc.news_id
                INNER JOIN news_categories nc ON nnc.news_category_id = nc.id
                $whereClause
            """.trimIndent()
            
            logger.info("COUNT実行SQL: $sql")
            logger.info("COUNTバインド値: $bindings")
            
            var sqlQuery = template.databaseClient.sql(sql)
            bindings.forEach { (key, value) ->
                sqlQuery = sqlQuery.bind(key, value)
            }
            
            val result = sqlQuery.map { row -> row.get(0, Number::class.java)?.toInt() ?: 0 }
                .first()
                .awaitSingle()
                
            logger.info("COUNT結果: $result")
            result
        } catch (e: Exception) {
            logger.error("検索結果総数取得エラー", e)
            0
        }
    }

    override suspend fun findAllCategories(): List<NewsCategory> {
        logger.info("ニュースカテゴリ一覧取得")
        return try {
            val categories = template.select(NewsCategoryEntity::class.java)
                .matching(Query.empty().sort(Sort.by(Sort.Direction.ASC, "sort_order")))
                .all()
                .collectList()
                .awaitSingle()
            
            categories.map { buildNewsCategory(it) }
        } catch (e: Exception) {
            logger.error("ニュースカテゴリ一覧取得エラー", e)
            emptyList()
        }
    }

    /**
     * JOINクエリの結果からNewsドメインモデルを構築（複数カテゴリ対応）
     */
    private fun buildNewsFromRowWithMultipleCategories(row: Row): News {
        try {
            // STRING_AGG で結合された文字列を分割してカテゴリリストを構築
            val categoryIdsStr = row.get("category_ids", String::class.java) ?: ""
            val categoryNamesStr = row.get("category_names", String::class.java) ?: ""
            val categorySortOrdersStr = row.get("category_sort_orders", String::class.java) ?: ""
            
            logger.debug("Row data - IDs: '$categoryIdsStr', Names: '$categoryNamesStr', SortOrders: '$categorySortOrdersStr'")
            
            val categories = if (categoryIdsStr.isNotEmpty()) {
                val ids = categoryIdsStr.split(",").map { it.trim() }
                val names = categoryNamesStr.split(",").map { it.trim() }
                val sortOrders = categorySortOrdersStr.split(",").map { it.trim() }
                
                if (ids.size == names.size && names.size == sortOrders.size) {
                    ids.zip(names).zip(sortOrders) { (id, name), sortOrder ->
                        NewsCategory(
                            id = id.toInt(),
                            name = name,
                            sortOrder = sortOrder.toInt()
                        )
                    }
                } else {
                    logger.warn("カテゴリデータの長さが不一致: ids=${ids.size}, names=${names.size}, sortOrders=${sortOrders.size}")
                    emptyList()
                }
            } else {
                logger.debug("カテゴリなしのニュース")
                emptyList()
            }
            
            return News(
                id = NewsId(row.get("id", String::class.java)!!),
                title = row.get("title", String::class.java)!!,
                categories = categories,
                content = row.get("content", String::class.java)!!,
                thumbnailUrl = row.get("thumbnail_url", String::class.java),
                externalUrl = row.get("external_url", String::class.java),
                publishedAt = row.get("published_at", Instant::class.java)!!
            )
        } catch (e: Exception) {
            logger.error("News構築エラー", e)
            throw e
        }
    }
    
    
    /**
     * NewsCategoryEntityからNewsCategoryドメインモデルを構築
     */
    private fun buildNewsCategory(entity: NewsCategoryEntity): NewsCategory {
        return NewsCategory(
            id = entity.id,
            name = entity.name,
            sortOrder = entity.sortOrder
        )
    }
}

/**
 * ニュースエンティティ（R2DBC用）
 */
@org.springframework.data.relational.core.mapping.Table("news")
data class NewsEntity(
    @org.springframework.data.annotation.Id
    val id: String,
    val title: String,
    val categoryId: Int,
    val content: String,
    val thumbnailUrl: String?,
    val externalUrl: String?,
    val publishedAt: Instant,
    val createdAt: Instant
)

/**
 * ニュースカテゴリエンティティ（R2DBC用）
 */
@org.springframework.data.relational.core.mapping.Table("news_categories")
data class NewsCategoryEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val name: String,
    val sortOrder: Int,
    val createdAt: Instant
)
