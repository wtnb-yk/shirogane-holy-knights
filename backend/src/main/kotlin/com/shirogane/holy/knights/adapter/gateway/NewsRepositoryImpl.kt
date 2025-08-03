package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.NewsRepository
import com.shirogane.holy.knights.application.dto.NewsListParamsDto
import com.shirogane.holy.knights.application.dto.NewsSearchParamsDto
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
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

    override suspend fun findAll(params: NewsListParamsDto): List<News> {
        logger.info("ニュース一覧取得: $params")
        return try {
            var criteria = Criteria.empty()
            
            params.categoryId?.let {
                criteria = criteria.and(Criteria.where("category_id").`is`(it))
            }
            
            val query = Query.query(criteria)
                .offset(params.getOffset().toLong())
                .limit(params.pageSize)
                .sort(Sort.by(Sort.Direction.DESC, "published_at"))
            
            val newsEntities = template.select(NewsEntity::class.java)
                .matching(query)
                .all()
                .collectList()
                .awaitSingle()
            
            newsEntities.map { buildNews(it) }
        } catch (e: Exception) {
            logger.error("ニュース一覧取得エラー", e)
            emptyList()
        }
    }

    override suspend fun searchNews(params: NewsSearchParamsDto): List<News> {
        logger.info("ニュース検索: $params")
        return try {
            var criteria = Criteria.empty()
            
            params.query?.let {
                criteria = criteria.and(
                    Criteria.where("title").like("%$it%")
                        .or(Criteria.where("nd.content").like("%$it%"))
                )
            }
            
            params.categoryId?.let {
                criteria = criteria.and(Criteria.where("category_id").`is`(it))
            }
            
            params.getStartDateAsInstant()?.let {
                criteria = criteria.and(Criteria.where("published_at").greaterThanOrEquals(it))
            }
            
            params.getEndDateAsInstant()?.let {
                criteria = criteria.and(Criteria.where("published_at").lessThanOrEquals(it))
            }
            
            
            val query = Query.query(criteria)
                .offset(params.getOffset().toLong())
                .limit(params.pageSize)
                .sort(Sort.by(Sort.Direction.DESC, "published_at"))
            
            val newsEntities = template.select(NewsEntity::class.java)
                .matching(query)
                .all()
                .collectList()
                .awaitSingle()
            
            newsEntities.map { buildNews(it) }
        } catch (e: Exception) {
            logger.error("ニュース検索エラー", e)
            emptyList()
        }
    }


    override suspend fun countAll(params: NewsListParamsDto): Int {
        logger.info("ニュース総数取得")
        return try {
            var criteria = Criteria.empty()
            
            params.categoryId?.let {
                criteria = criteria.and(Criteria.where("category_id").`is`(it))
            }
            
            template.count(Query.query(criteria), NewsEntity::class.java)
                .awaitSingle()
                .toInt()
        } catch (e: Exception) {
            logger.error("ニュース総数取得エラー", e)
            0
        }
    }

    override suspend fun countSearchResults(params: NewsSearchParamsDto): Int {
        logger.info("検索結果総数取得")
        return try {
            var criteria = Criteria.empty()
            
            params.query?.let {
                criteria = criteria.and(
                    Criteria.where("title").like("%$it%")
                        .or(Criteria.where("nd.content").like("%$it%"))
                )
            }
            
            params.categoryId?.let {
                criteria = criteria.and(Criteria.where("category_id").`is`(it))
            }
            
            params.getStartDateAsInstant()?.let {
                criteria = criteria.and(Criteria.where("published_at").greaterThanOrEquals(it))
            }
            
            params.getEndDateAsInstant()?.let {
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

    override suspend fun findCategoryById(categoryId: Int): NewsCategory? {
        logger.info("ニュースカテゴリ取得: id=$categoryId")
        return try {
            val categoryEntity = template.select(NewsCategoryEntity::class.java)
                .matching(Query.query(Criteria.where("id").`is`(categoryId)))
                .one()
                .awaitSingleOrNull()
            
            categoryEntity?.let { buildNewsCategory(it) }
        } catch (e: Exception) {
            logger.error("ニュースカテゴリ取得エラー", e)
            null
        }
    }

    override suspend fun save(news: News): News {
        // TODO: 実装（管理機能用）
        throw NotImplementedError("save機能は管理機能実装時に追加予定")
    }

    override suspend fun update(news: News): News {
        // TODO: 実装（管理機能用）
        throw NotImplementedError("update機能は管理機能実装時に追加予定")
    }

    override suspend fun deleteById(id: NewsId): Boolean {
        // TODO: 実装（管理機能用）
        throw NotImplementedError("delete機能は管理機能実装時に追加予定")
    }

    /**
     * NewsEntityからNewsドメインモデルを構築
     */
    private suspend fun buildNews(entity: NewsEntity): News {
        val category = findCategoryById(entity.categoryId) 
            ?: throw IllegalStateException("カテゴリが見つかりません: ${entity.categoryId}")
        
        val newsDetails = findNewsDetailsById(entity.id)
        
        return News(
            id = NewsId(entity.id),
            title = entity.title,
            category = category,
            publishedAt = entity.publishedAt,
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
    
    /**
     * ニュース詳細情報を取得
     */
    private suspend fun findNewsDetailsById(newsId: String): NewsDetails? {
        return try {
            val detailsEntity = template.select(NewsDetailsEntity::class.java)
                .matching(Query.query(Criteria.where("news_id").`is`(newsId)))
                .one()
                .awaitSingleOrNull()
            
            detailsEntity?.let {
                NewsDetails(
                    content = it.content,
                    summary = it.summary,
                    thumbnailUrl = it.thumbnailUrl,
                    externalUrl = it.externalUrl
                )
            }
        } catch (e: Exception) {
            logger.error("ニュース詳細取得エラー", e)
            null
        }
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