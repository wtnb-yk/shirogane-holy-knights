package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Archive
import com.shirogane.holy.knights.domain.model.ArchiveId
import java.time.Instant

/**
 * アーカイブリポジトリインターフェース
 * リポジトリパターンに従い、永続化の詳細を抽象化
 */
interface ArchiveRepository {
    /**
     * 全アーカイブを取得
     * @param limit 取得上限数
     * @param offset オフセット
     * @return アーカイブのリスト
     */
    suspend fun findAll(limit: Int, offset: Int): List<Archive>
    
    /**
     * 総件数を取得
     * @return アーカイブの総数
     */
    suspend fun count(): Int
    
    /**
     * IDによるアーカイブ取得
     * @param id アーカイブID
     * @return アーカイブ情報（存在しない場合はnull）
     */
    suspend fun findById(id: ArchiveId): Archive?
    
    /**
     * 検索条件による検索
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @param limit 取得上限数
     * @param offset オフセット
     * @return 検索条件に合致するアーカイブのリスト
     */
    suspend fun search(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null,
        limit: Int,
        offset: Int
    ): List<Archive>
    
    /**
     * 検索条件による総件数取得
     * @param query タイトル・説明の部分一致検索クエリ
     * @param tags タグによるフィルタリング
     * @param startDate 開始日時
     * @param endDate 終了日時
     * @return 検索条件に合致するアーカイブの総数
     */
    suspend fun countBySearchCriteria(
        query: String? = null,
        tags: List<String>? = null,
        startDate: Instant? = null,
        endDate: Instant? = null
    ): Int
}