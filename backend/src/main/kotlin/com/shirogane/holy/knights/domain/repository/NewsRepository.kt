package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.News
import com.shirogane.holy.knights.domain.model.NewsCategory
import com.shirogane.holy.knights.domain.model.NewsId
import java.time.Instant

/**
 * ニュースリポジトリインターフェース
 * ドメイン層で定義するアウトバウンドポート
 */
interface NewsRepository {
    /**
     * ニュース検索
     */
    suspend fun search(
        query: String? = null,
        categoryId: Int? = null, // 後方互換性のため保持
        categoryIds: List<Int>? = null, // 複数カテゴリ対応
        startDate: Instant? = null,
        endDate: Instant? = null,
        limit: Int,
        offset: Int
    ): List<News>

    /**
     * ニュース検索結果総件数を取得
     */
    suspend fun countBySearchCriteria(
        query: String? = null,
        categoryId: Int? = null, // 後方互換性のため保持  
        categoryIds: List<Int>? = null, // 複数カテゴリ対応
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int

    /**
     * 全カテゴリを取得
     */
    suspend fun findAllCategories(): List<NewsCategory>
}
