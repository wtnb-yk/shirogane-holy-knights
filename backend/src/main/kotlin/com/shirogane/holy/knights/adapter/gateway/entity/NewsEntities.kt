package com.shirogane.holy.knights.adapter.gateway.entity

import java.time.Instant

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

@org.springframework.data.relational.core.mapping.Table("news_categories")
data class NewsCategoryEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val name: String,
    val sortOrder: Int,
    val createdAt: Instant
)