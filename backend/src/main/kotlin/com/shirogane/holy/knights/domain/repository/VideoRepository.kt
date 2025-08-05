package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Video
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
    suspend fun search(
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
    suspend fun countBySearchCriteria(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int
}
