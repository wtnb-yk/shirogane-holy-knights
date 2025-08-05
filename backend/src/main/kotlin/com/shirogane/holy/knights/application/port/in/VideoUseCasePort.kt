package com.shirogane.holy.knights.application.port.`in`

import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto

/**
 * 動画ユースケース入力ポート
 * 外部（コントローラー）からアプリケーション層への入口
 */
interface VideoUseCasePort {
    /**
     * 動画一覧を取得
     * @param page ページ番号（1始まり）
     * @param pageSize 1ページあたりの件数
     * @return 動画検索結果DTO
     */
    suspend fun getAllVideos(page: Int = 1, pageSize: Int = 20): VideoSearchResultDto
    
    /**
     * IDによる動画詳細取得
     * @param id 動画ID
     * @return 動画DTO（存在しない場合はnull）
     */
    suspend fun getVideoById(id: String): VideoDto?
    
    /**
     * 動画検索
     * @param searchParams 検索条件
     * @return 動画検索結果DTO
     */
    suspend fun searchVideos(searchParams: VideoSearchParamsDto): VideoSearchResultDto
    
    /**
     * 関連動画取得
     * @param id 動画ID
     * @param limit 取得上限
     * @return 動画DTOのリスト
     */
    suspend fun getRelatedVideos(id: String, limit: Int = 5): List<VideoDto>
}