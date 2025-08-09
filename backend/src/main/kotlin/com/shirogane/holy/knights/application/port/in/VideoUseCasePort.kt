package com.shirogane.holy.knights.application.port.`in`

import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSearchResultDto

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
    
    /**
     * 配信検索
     * @param searchParams 検索条件
     * @return 配信検索結果DTO
     */
    suspend fun searchStreams(searchParams: StreamSearchParamsDto): StreamSearchResultDto
    
    /**
     * 全ての配信タグを取得
     * @return 配信タグ名のリスト
     */
    suspend fun getAllStreamTags(): List<String>
    
    /**
     * 全ての動画タグを取得
     * @return 動画タグ名のリスト
     */
    suspend fun getAllVideoTags(): List<String>
}
