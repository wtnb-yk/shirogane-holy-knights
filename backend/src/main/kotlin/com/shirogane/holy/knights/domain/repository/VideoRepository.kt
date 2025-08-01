package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Video
import com.shirogane.holy.knights.domain.model.VideoId
import java.time.Instant

/**
 * 動画リポジトリインターフェース
 * リポジトリパターンに従い、永続化の詳細を抽象化
 */
interface VideoRepository {
    /**
     * 全動画を取得
     * @param limit 取得上限数
     * @param offset オフセット
     * @return 動画のリスト
     */
    fun findAll(limit: Int, offset: Int): List<Video>
    
    /**
     * 総件数を取得
     * @return 動画の総数
     */
    fun count(): Int
    
    /**
     * IDによる動画取得
     * @param id 動画ID
     * @return 動画情報（存在しない場合はnull）
     */
    fun findById(id: VideoId): Video?
    
    /**
     * 検索条件による検索
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @param limit 取得上限数
     * @param offset オフセット
     * @return 検索条件に合致する動画のリスト
     */
    fun search(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null,
        limit: Int,
        offset: Int
    ): List<Video>
    
    /**
     * 検索条件による総件数取得
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @return 検索条件に合致する動画の総数
     */
    fun countBySearchCriteria(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int
    
    /**
     * 関連動画取得
     * @param id 動画ID
     * @param limit 取得上限数
     * @return 関連する動画のリスト
     */
    fun getRelatedVideos(id: VideoId, limit: Int): List<Video>
}