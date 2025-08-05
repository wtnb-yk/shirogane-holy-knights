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
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<News> {
        logger.info("ニュース検索: query=$query, categoryId=$categoryId, startDate=$startDate, endDate=$endDate, limit=$limit, offset=$offset")
        return try {
            searchWithJoin(query, categoryId, startDate, endDate, limit, offset)
        } catch (e: Exception) {
            logger.error("ニュース検索エラー", e)
            emptyList()
        }
    }

    /**
     * JOINクエリを使った最適化されたニュース検索
     */
    private suspend fun searchWithJoin(
        query: String?,
        categoryId: Int?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<News> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
        // WHERE句の動的構築
        query?.let {
            conditions.add("(n.title LIKE :query OR nd.content LIKE :query)")
            bindings["query"] = "%$it%"
        }
        
        categoryId?.let {
            conditions.add("n.category_id = :categoryId")
            bindings["categoryId"] = it
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
            SELECT 
                n.id, n.title, n.published_at,
                nc.id as category_id, nc.name as category_name, 
                nc.display_name as category_display_name,
                nc.description as category_description,
                nc.sort_order as category_sort_order,
                nd.content, nd.summary, nd.thumbnail_url, nd.external_url
            FROM news n
            INNER JOIN news_categories nc ON n.category_id = nc.id
            LEFT JOIN news_details nd ON n.id = nd.news_id
            $whereClause
            ORDER BY n.published_at DESC
            LIMIT :limit OFFSET :offset
        """.trimIndent()
        
        var sqlQuery = template.databaseClient.sql(sql)
        bindings.forEach { (key, value) ->
            sqlQuery = sqlQuery.bind(key, value)
        }
        sqlQuery = sqlQuery.bind("limit", limit).bind("offset", offset)
        
        return sqlQuery.map { row -> buildNewsFromRow(row as Row) }
            .all()
            .collectList()
            .awaitSingle()
    }

    override suspend fun countBySearchCriteria(
        query: String?,
        categoryId: Int?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        logger.info("検索結果総数取得: query=$query, categoryId=$categoryId, startDate=$startDate, endDate=$endDate")
        return try {
            var criteria = Criteria.empty()
            
            query?.let {
                criteria = criteria.and(
                    Criteria.where("title").like("%$it%")
                        .or(Criteria.where("nd.content").like("%$it%"))
                )
            }
            
            categoryId?.let {
                criteria = criteria.and(Criteria.where("category_id").`is`(it))
            }
            
            startDate?.let {
                criteria = criteria.and(Criteria.where("published_at").greaterThanOrEquals(it))
            }
            
            endDate?.let {
                criteria = criteria.and(Criteria.where("published_at").lessThanOrEquals(it))
            }
            
            template.count(Query.query(criteria), NewsEntity::class.java)
                .awaitSingle()
                .toInt()
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
     * JOINクエリの結果からNewsドメインモデルを構築
     */
    private fun buildNewsFromRow(row: Row): News {
        val category = NewsCategory(
            id = row.get("category_id", Integer::class.java)!!.toInt(),
            name = row.get("category_name", String::class.java)!!,
            displayName = row.get("category_display_name", String::class.java)!!,
            description = row.get("category_description", String::class.java),
            sortOrder = row.get("category_sort_order", Integer::class.java)!!.toInt()
        )
        
        val newsDetails = NewsDetails(
            content = row.get("content", String::class.java) ?: "",
            summary = row.get("summary", String::class.java),
            thumbnailUrl = row.get("thumbnail_url", String::class.java),
            externalUrl = row.get("external_url", String::class.java)
        )
        
        return News(
            id = NewsId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            category = category,
            publishedAt = row.get("published_at", Instant::class.java)!!,
            newsDetails = newsDetails
        )
    }
    
    /**
     * NewsCategoryEntityからNewsCategoryドメインモデルを構築
     */
    private fun buildNewsCategory(entity: NewsCategoryEntity): NewsCategory {
        return NewsCategory(
            id = entity.id,
            name = entity.name,
            displayName = entity.displayName,
            description = entity.description,
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
    val publishedAt: Instant,
    val createdAt: Instant
)

/**
 * ニュース詳細エンティティ（R2DBC用）
 */
@org.springframework.data.relational.core.mapping.Table("news_details")
data class NewsDetailsEntity(
    @org.springframework.data.annotation.Id
    val newsId: String,
    val content: String,
    val summary: String?,
    val thumbnailUrl: String?,
    val externalUrl: String?,
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
    val displayName: String,
    val description: String?,
    val sortOrder: Int,
    val createdAt: Instant
)
