package com.shirogane.holy.knights.application.port.`in`

import com.shirogane.holy.knights.application.dto.*

/**
 * ニュースユースケースポート
 * アプリケーション層のインバウンドポート
 */
interface NewsUseCasePort {

    /**
     * ニュース一覧を取得
     */
    suspend fun getNewsList(params: NewsListParamsDto): NewsSearchResultDto

    /**
     * ニュース検索
     */
    suspend fun searchNews(params: NewsSearchParamsDto): NewsSearchResultDto

    /**
     * ニュース詳細を取得
     */
    suspend fun getNewsById(id: String): NewsDto?

    /**
     * ニュースカテゴリ一覧を取得
     */
    suspend fun getNewsCategories(): List<NewsCategoryDto>
}