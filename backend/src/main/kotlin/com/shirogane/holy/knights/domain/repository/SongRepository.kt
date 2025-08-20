package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Song
import com.shirogane.holy.knights.domain.model.SongStats

interface SongRepository {
    /**
     * 楽曲検索
     * @param query タイトル・アーティスト名での部分一致検索クエリ
     * @param sortBy 並び替え項目（singCount, latestSingDate, title）
     * @param sortOrder 並び替え順（ASC, DESC）
     * @param limit 取得上限数
     * @param offset オフセット
     * @return 検索条件に合致する楽曲のリスト
     */
    suspend fun searchPerformedSongs(
        query: String? = null,
        sortBy: String = "singCount",
        sortOrder: String = "DESC",
        limit: Int,
        offset: Int
    ): List<Song>
    
    /**
     * 楽曲検索の総件数取得
     * @param query タイトル・アーティスト名での部分一致検索クエリ
     * @return 検索条件に合致する楽曲の総数
     */
    suspend fun countPerformedSongs(
        query: String? = null
    ): Int
    
    /**
     * 楽曲統計情報取得
     * @param topSongsLimit 上位楽曲の取得件数
     * @param recentPerformancesLimit 最新歌唱の取得件数
     * @return 楽曲統計情報
     */
    suspend fun getPerformedSongsStats(
        topSongsLimit: Int = 10,
        recentPerformancesLimit: Int = 10
    ): SongStats
}