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
        categoryId: Int? = null,
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
        categoryId: Int? = null,
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int

    /**
     * 全カテゴリを取得
     */
    suspend fun findAllCategories(): List<NewsCategory>

    /**
     * カテゴリIDでカテゴリを取得
     */
    suspend fun findCategoryById(categoryId: Int): NewsCategory?

    /**
     * ニュース作成
     */
    suspend fun save(news: News): News

    /**
     * ニュース更新
     */
    suspend fun update(news: News): News

    /**
     * ニュース削除
     */
    suspend fun deleteById(id: NewsId): Boolean
}
