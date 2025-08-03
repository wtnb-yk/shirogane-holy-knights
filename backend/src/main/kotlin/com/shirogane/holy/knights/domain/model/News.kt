package com.shirogane.holy.knights.domain.model

import java.time.Instant

/**
 * ニュースドメインモデル
 * ドメイン層の中心的なエンティティ
 */
data class News(
    val id: NewsId,
    val title: String,
    val category: NewsCategory,
    val publishedAt: Instant,
    val newsDetails: NewsDetails? = null
)

/**
 * ニュース詳細情報値オブジェクト
 */
data class NewsDetails(
    val content: String,
    val summary: String? = null,
    val thumbnailUrl: String? = null,
    val externalUrl: String? = null
)

/**
 * ニュースID値オブジェクト
 */
@JvmInline
value class NewsId(val value: String) {
    override fun toString(): String = value
}

/**
 * ニュースカテゴリ値オブジェクト
 */
data class NewsCategory(
    val id: Int,
    val name: String,
    val displayName: String,
    val description: String? = null,
    val sortOrder: Int = 0
)