package com.shirogane.holy.knights.application.port.`in`

import arrow.core.Either
import com.shirogane.holy.knights.application.dto.*
import com.shirogane.holy.knights.application.usecase.UseCaseError

/**
 * ニュースユースケースポート
 * アプリケーション層のインバウンドポート
 */
interface NewsUseCasePort {

    /**
     * ニュース検索
     */
    suspend fun searchNews(params: NewsSearchParamsDto): Either<UseCaseError, NewsSearchResultDto>

    /**
     * ニュースカテゴリ一覧を取得
     */
    suspend fun getNewsCategories(): List<NewsCategoryDto>
}
