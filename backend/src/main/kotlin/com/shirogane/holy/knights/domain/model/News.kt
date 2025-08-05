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
    val content: String,
    val thumbnailUrl: String? = null,
    val externalUrl: String? = null,
    val publishedAt: Instant
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
    val sortOrder: Int = 0
)