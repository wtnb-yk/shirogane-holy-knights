package com.shirogane.holy.knights.domain.service

import com.shirogane.holy.knights.domain.model.Archive
import com.shirogane.holy.knights.domain.model.ArchiveId
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import org.springframework.stereotype.Service
import java.time.Instant

/**
 * アーカイブドメインサービス
 * 複数のエンティティを跨いだビジネスロジックや
 * 1つのエンティティに閉じることが不自然な操作を担当
 */
@Service
class ArchiveDomainService(private val archiveRepository: ArchiveRepository) {
    
    /**
     * タグに基づく関連アーカイブ取得
     * 指定されたアーカイブと同じタグを持つ他のアーカイブを取得
     * 
     * @param archiveId 対象アーカイブID
     * @param limit 取得上限
     * @return 関連アーカイブのリスト
     */
    fun findRelatedArchives(archiveId: ArchiveId, limit: Int): List<Archive> {
        val archive = archiveRepository.findById(archiveId) ?: return emptyList()
        
        // タグが無い場合は関連アーカイブも取得できない
        if (archive.tags.isEmpty()) {
            return emptyList()
        }
        
        // タグ名のリストを抽出
        val tagNames = archive.tags.map { it.name }
        
        // 同じタグを持つアーカイブを検索し、対象アーカイブを除外
        return archiveRepository.search(
            tags = tagNames,
            limit = limit + 1, // 自身も含まれる可能性があるため +1
            offset = 0
        ).filter { it.id != archiveId }.take(limit)
    }
    
    /**
     * 期間による人気アーカイブ取得（将来的な機能）
     * 
     * @param startDate 開始日
     * @param endDate 終了日
     * @param limit 取得上限
     * @return 人気アーカイブのリスト
     */
    fun findPopularArchives(startDate: Instant, endDate: Instant, limit: Int): List<Archive> {
        // 視聴回数や「いいね」などの指標でソートする予定
        // 現状では日付の新しい順に返す
        return archiveRepository.search(
            startDate = startDate,
            endDate = endDate,
            limit = limit,
            offset = 0
        )
    }
}