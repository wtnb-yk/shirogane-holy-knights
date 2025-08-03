package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.News
import com.shirogane.holy.knights.domain.model.NewsCategory
import com.shirogane.holy.knights.domain.model.NewsId
import com.shirogane.holy.knights.application.dto.NewsListParamsDto
import com.shirogane.holy.knights.application.dto.NewsSearchParamsDto

/**
 * ニュースリポジトリインターフェース
 * ドメイン層で定義するアウトバウンドポート
 */
interface NewsRepository {

    /**
     * ニュース一覧を取得
     */
    suspend fun findAll(params: NewsListParamsDto): List<News>

    /**
     * ニュース検索
     */
    suspend fun searchNews(params: NewsSearchParamsDto): List<News>

    /**
     * ニュースIDで単一ニュースを取得
     */
    suspend fun findById(id: NewsId): News?

    /**
     * ニュース総件数を取得（ページング用）
     */
    suspend fun countAll(params: NewsListParamsDto): Int

    /**
     * ニュース検索結果総件数を取得（ページング用）
     */
    suspend fun countSearchResults(params: NewsSearchParamsDto): Int

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