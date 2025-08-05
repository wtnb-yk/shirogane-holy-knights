package com.shirogane.holy.knights.application.port.`in`

import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto

/**
 * 動画ユースケース入力ポート
 */
interface VideoUseCasePort {
    /**
     * 動画検索
     * @param searchParams 検索条件
     * @return 動画検索結果DTO
     */
    suspend fun searchVideos(searchParams: VideoSearchParamsDto): VideoSearchResultDto
}
