package com.shirogane.holy.knights.adapter.controller.port

import arrow.core.Either
import com.shirogane.holy.knights.adapter.controller.dto.NewsCategoryDto
import com.shirogane.holy.knights.adapter.controller.dto.NewsSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.NewsSearchResultDto
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
