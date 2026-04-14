package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.model.NewsSearchCriteria
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class NewsQueryBuilder : QueryBuilder<NewsSearchCriteria> {
    
    override fun buildSearchQuery(criteria: NewsSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.categoryIds,
            criteria.startDate,
            criteria.endDate
        )
        
        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""
        
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
        
        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset
        )
        
        return QuerySpec(sql, bindings)
    }
    
    override fun buildCountQuery(criteria: NewsSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.categoryIds,
            criteria.startDate,
            criteria.endDate
        )
        
        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""
        
        val sql = """
            SELECT COUNT(DISTINCT n.id)
            FROM news n
            INNER JOIN news_news_categories nnc ON n.id = nnc.news_id
            INNER JOIN news_categories nc ON nnc.news_category_id = nc.id
            $whereClause
        """.trimIndent()
        
        return QuerySpec(sql, conditions.second)
    }
    
    private fun buildSearchConditions(
        query: String?,
        categoryIds: List<Int>?,
        startDate: Instant?,
        endDate: Instant?
    ): Pair<List<String>, Map<String, Any>> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
        query?.let {
            conditions.add("(n.title ILIKE :query OR n.content ILIKE :query)")
            bindings["query"] = "%$it%"
        }
        
        categoryIds?.takeIf { it.isNotEmpty() }?.let {
            conditions.add("nnc.news_category_id = ANY(:categoryIds)")
            bindings["categoryIds"] = it.toTypedArray()
        }
        
        startDate?.let {
            conditions.add("n.published_at >= :startDate")
            bindings["startDate"] = it
        }
        
        endDate?.let {
            conditions.add("n.published_at <= :endDate")
            bindings["endDate"] = it
        }
        
        return Pair(conditions, bindings)
    }
}