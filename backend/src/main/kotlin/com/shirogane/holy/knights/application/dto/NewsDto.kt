package com.shirogane.holy.knights.application.dto

import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable
import java.time.Instant

/**
 * ニュースDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class NewsDto(
    val id: String,
    val title: String,
    val categories: List<NewsCategoryDto>,
    val publishedAt: String, // ISO 8601形式の日時文字列
    val content: String? = null,
    val summary: String? = null,
    val thumbnailUrl: String? = null,
    val externalUrl: String? = null,
    // 後方互換性のため単一カテゴリ情報も保持（最初のカテゴリを使用）
    val categoryId: Int? = null,
    val categoryName: String? = null
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(news: News): NewsDto {
            val categoryDtos = news.categories.map { NewsCategoryDto.fromDomain(it) }
            val firstCategory = news.categories.firstOrNull()
            
            return NewsDto(
                id = news.id.value,
                title = news.title,
                categories = categoryDtos,
                publishedAt = news.publishedAt.toString(),
                content = news.content,
                thumbnailUrl = news.thumbnailUrl,
                externalUrl = news.externalUrl,
                // 後方互換性のため
                categoryId = firstCategory?.id,
                categoryName = firstCategory?.name
            )
        }
    }
}

/**
 * ニュースカテゴリDTO
 */
@Serializable
data class NewsCategoryDto(
    val id: Int,
    val name: String,
    val sortOrder: Int = 0
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(category: NewsCategory): NewsCategoryDto {
            return NewsCategoryDto(
                id = category.id,
                name = category.name,
                sortOrder = category.sortOrder
            )
        }
    }
}

/**
 * ニュース検索パラメータDTO
 */
data class NewsSearchParamsDto(
    val query: String? = null,
    val categoryId: Int? = null, // 後方互換性のため保持
    val categoryIds: List<Int>? = null, // 複数カテゴリ対応
    val startDate: String? = null, // ISO 8601形式の日時文字列
    val endDate: String? = null,   // ISO 8601形式の日時文字列
    val page: Int = 1,
    val pageSize: Int = 20
) {
    /**
     * startDateをInstantに変換
     */
    fun getStartDateAsInstant(): Instant? {
        return startDate?.let { Instant.parse(it) }
    }
    
    /**
     * endDateをInstantに変換
     */
    fun getEndDateAsInstant(): Instant? {
        return endDate?.let { Instant.parse(it) }
    }
    
    /**
     * オフセットを計算
     */
    fun getOffset(): Int {
        return (page - 1) * pageSize
    }
    
    /**
     * 有効なカテゴリIDリストを取得（後方互換性対応）
     */
    fun getEffectiveCategoryIds(): List<Int>? {
        return when {
            // 新しい形式（複数カテゴリ）が指定されている場合
            !categoryIds.isNullOrEmpty() -> categoryIds
            // 旧形式（単一カテゴリ）が指定されている場合
            categoryId != null -> listOf(categoryId)
            // どちらも指定されていない場合
            else -> null
        }
    }
}

/**
 * ニュース検索結果DTO
 */
@Serializable
data class NewsSearchResultDto(
    val items: List<NewsDto>,
    val totalCount: Int,
    val page: Int,
    val pageSize: Int,
    val hasMore: Boolean
)


