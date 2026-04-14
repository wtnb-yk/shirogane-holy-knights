package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.*
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class NewsRowMapper : RowMapper<News> {
    
    override fun map(row: Row): News {
        val categories = parseCategories(
            categoryIdsStr = row.get("category_ids", String::class.java) ?: "",
            categoryNamesStr = row.get("category_names", String::class.java) ?: "",
            categorySortOrdersStr = row.get("category_sort_orders", String::class.java) ?: ""
        )
        
        return News(
            id = NewsId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            categories = categories,
            content = row.get("content", String::class.java)!!,
            thumbnailUrl = row.get("thumbnail_url", String::class.java),
            externalUrl = row.get("external_url", String::class.java),
            publishedAt = row.get("published_at", Instant::class.java)!!
        )
    }
    
    private fun parseCategories(
        categoryIdsStr: String,
        categoryNamesStr: String, 
        categorySortOrdersStr: String
    ): List<NewsCategory> {
        if (categoryIdsStr.isEmpty()) return emptyList()
        
        val ids = categoryIdsStr.split(",").map { it.trim() }
        val names = categoryNamesStr.split(",").map { it.trim() }
        val sortOrders = categorySortOrdersStr.split(",").map { it.trim() }
        
        return if (ids.size == names.size && names.size == sortOrders.size) {
            ids.zip(names).zip(sortOrders) { (id, name), sortOrder ->
                NewsCategory(
                    id = id.toInt(),
                    name = name,
                    sortOrder = sortOrder.toInt()
                )
            }
        } else {
            emptyList()
        }
    }
}