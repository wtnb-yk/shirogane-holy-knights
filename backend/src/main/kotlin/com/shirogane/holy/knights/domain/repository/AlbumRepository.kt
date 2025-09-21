package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.*
import java.time.LocalDate

/**
 * アルバムリポジトリインターフェース
 * ドメイン層で定義するアウトバウンドポート
 */
interface AlbumRepository {
    /**
     * アルバム検索
     */
    suspend fun search(
        query: String? = null,
        albumTypes: List<String>? = null,
        startDate: LocalDate? = null,
        endDate: LocalDate? = null,
        sortBy: String = "releaseDate",
        sortOrder: String = "DESC",
        limit: Int,
        offset: Int
    ): Albums

    /**
     * アルバム検索結果総件数を取得
     */
    suspend fun countBySearchCriteria(
        query: String? = null,
        albumTypes: List<String>? = null,
        startDate: LocalDate? = null,
        endDate: LocalDate? = null
    ): Int

    /**
     * IDでアルバム詳細を取得
     */
    suspend fun findById(albumId: AlbumId): Album?

    /**
     * 全アルバムタイプを取得
     */
    suspend fun findAllAlbumTypes(): List<AlbumType>
}