package com.shirogane.holy.knights.adapter.controller.port

import arrow.core.Either
import com.shirogane.holy.knights.adapter.controller.dto.AlbumDto
import com.shirogane.holy.knights.adapter.controller.dto.AlbumSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.AlbumSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.AlbumTypeDto
import com.shirogane.holy.knights.application.usecase.UseCaseError

/**
 * アルバムユースケースポート
 * Controller層からUseCase層への依存を表現するインターフェース
 */
interface AlbumUseCasePort {
    /**
     * アルバム検索
     */
    suspend fun searchAlbums(params: AlbumSearchParamsDto): Either<UseCaseError, AlbumSearchResultDto>

    /**
     * アルバム詳細取得
     */
    suspend fun getAlbumDetails(albumId: String): Either<UseCaseError, AlbumDto>

    /**
     * 全アルバムタイプを取得
     */
    suspend fun getAllAlbumTypes(): List<AlbumTypeDto>
}