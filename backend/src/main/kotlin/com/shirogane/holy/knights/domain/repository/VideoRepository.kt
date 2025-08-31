package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Videos
import java.time.Instant

interface VideoRepository {
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
    suspend fun searchVideos(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null,
        limit: Int,
        offset: Int
    ): Videos
    
    /**
     * 検索条件による総件数取得
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @return 検索条件に合致する動画の総数
     */
    suspend fun countVideos(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int
    
    /**
     * 配信検索条件による検索
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @param limit 取得上限数
     * @param offset オフセット
     * @return 検索条件に合致する配信のリスト
     */
    suspend fun searchStreams(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null,
        limit: Int,
        offset: Int
    ): Videos
    
    /**
     * 配信検索条件による総件数取得
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @return 検索条件に合致する配信の総数
     */
    suspend fun countStreams(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int
    
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
