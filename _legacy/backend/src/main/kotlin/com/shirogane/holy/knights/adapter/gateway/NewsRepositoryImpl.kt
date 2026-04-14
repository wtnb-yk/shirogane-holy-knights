package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.NewsRepository
import com.shirogane.holy.knights.adapter.gateway.entity.*
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.adapter.gateway.query.NewsQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.mapper.NewsRowMapper
import com.shirogane.holy.knights.adapter.gateway.model.NewsSearchCriteria
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Query
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class NewsRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val newsQueryBuilder: NewsQueryBuilder,
    private val newsRowMapper: NewsRowMapper,
    private val template: R2dbcEntityTemplate
) : NewsRepository {

    override suspend fun search(
        query: String?,
        categoryIds: List<Int>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): NewsList {
        val criteria = NewsSearchCriteria(
            query = query,
            categoryIds = categoryIds,
            startDate = startDate,
            endDate = endDate,
            limit = limit,
            offset = offset
        )
        
        val querySpec = newsQueryBuilder.buildSearchQuery(criteria)
        val newsList = queryExecutor.execute(querySpec, newsRowMapper)
        
        return NewsList(newsList)
    }


    override suspend fun countBySearchCriteria(
        query: String?,
        categoryIds: List<Int>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        val criteria = NewsSearchCriteria(
            query = query,
            categoryIds = categoryIds,
            startDate = startDate,
            endDate = endDate,
            limit = 0,
            offset = 0
        )
        
        val querySpec = newsQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun findAllCategories(): List<NewsCategory> {
        val categories = template.select(NewsCategoryEntity::class.java)
            .matching(Query.empty().sort(Sort.by(Sort.Direction.ASC, "sort_order")))
            .all()
            .collectList()
            .awaitSingle()
        
        return categories.map { buildNewsCategory(it) }
    }

    private fun buildNewsCategory(entity: NewsCategoryEntity): NewsCategory {
        return NewsCategory(
            id = entity.id,
            name = entity.name,
            sortOrder = entity.sortOrder
        )
    }
}
