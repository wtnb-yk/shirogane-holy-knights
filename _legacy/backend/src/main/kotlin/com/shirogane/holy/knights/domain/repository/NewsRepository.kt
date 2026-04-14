package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.NewsCategory
import com.shirogane.holy.knights.domain.model.NewsList
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
        categoryIds: List<Int>? = null, // 複数カテゴリ対応
        startDate: Instant? = null,
        endDate: Instant? = null,
        limit: Int,
        offset: Int
    ): NewsList

    /**
     * ニュース検索結果総件数を取得
     */
    suspend fun countBySearchCriteria(
        query: String? = null,
        categoryIds: List<Int>? = null, // 複数カテゴリ対応
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int

    /**
     * 全カテゴリを取得
     */
    suspend fun findAllCategories(): List<NewsCategory>
}
