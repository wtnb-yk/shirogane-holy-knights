package com.shirogane.holy.knights.application.port.`in`

import com.shirogane.holy.knights.application.dto.ArchiveDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto

/**
 * アーカイブユースケース入力ポート
 * 外部（コントローラー）からアプリケーション層への入口
 */
interface ArchiveUseCasePort {
    /**
     * アーカイブ一覧を取得
     * @param page ページ番号（1始まり）
     * @param pageSize 1ページあたりの件数
     * @return アーカイブ検索結果DTO
     */
    fun getAllArchives(page: Int = 1, pageSize: Int = 20): ArchiveSearchResultDto
    
    /**
     * IDによるアーカイブ詳細取得
     * @param id アーカイブID
     * @return アーカイブDTO（存在しない場合はnull）
     */
    suspend fun getArchiveById(id: String): ArchiveDto?
    
    /**
     * アーカイブ検索
     * @param searchParams 検索条件
     * @return アーカイブ検索結果DTO
     */
    suspend fun searchArchives(searchParams: ArchiveSearchParamsDto): ArchiveSearchResultDto
    
    /**
     * 関連アーカイブ取得
     * @param id アーカイブID
     * @param limit 取得上限
     * @return アーカイブDTOのリスト
     */
    suspend fun getRelatedArchives(id: String, limit: Int = 5): List<ArchiveDto>
}