package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.ArchiveDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import com.shirogane.holy.knights.domain.model.ArchiveId
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import com.shirogane.holy.knights.domain.service.ArchiveDomainService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service

/**
 * アーカイブユースケース実装
 * アプリケーション層のビジネスロジック
 * コントローラーからの入力を受け取り、ドメイン層の操作を調整し、結果をDTOに変換して返す
 */
@Service
class ArchiveUseCaseImpl(
    private val archiveRepository: ArchiveRepository,
    private val archiveDomainService: ArchiveDomainService,
    private val coroutineScope: kotlinx.coroutines.CoroutineScope
) : ArchiveUseCasePort {
    /**
     * アーカイブ一覧を取得
     * @param page ページ番号（1始まり）
     * @param pageSize 1ページあたりの件数
     * @return アーカイブ検索結果DTO
     */
    override fun getAllArchives(page: Int, pageSize: Int): ArchiveSearchResultDto {
        // コルーチンなしで実装する
        // これによりSpring環境でのコルーチンコンテキスト問題を回避
        val offset = (page - 1) * pageSize
        val archives = archiveRepository.findAll(pageSize, offset)
        val totalCount = archiveRepository.count()
        
        return ArchiveSearchResultDto(
            items = archives.map { ArchiveDto.fromDomain(it) },
            totalCount = totalCount,
            page = page,
            pageSize = pageSize,
            hasMore = (offset + archives.size) < totalCount
        )
    }

    /**
     * IDによるアーカイブ詳細取得
     * @param id アーカイブID
     * @return アーカイブDTO（存在しない場合はnull）
     */
    override suspend fun getArchiveById(id: String): ArchiveDto? {
        val context = coroutineScope.coroutineContext + Dispatchers.IO
        return withContext(context) {
            val archiveId = ArchiveId(id)
            val archive = archiveRepository.findById(archiveId) ?: return@withContext null
            ArchiveDto.fromDomain(archive)
        }
    }

    /**
     * アーカイブ検索
     * @param searchParams 検索条件
     * @return アーカイブ検索結果DTO
     */
    override suspend fun searchArchives(searchParams: ArchiveSearchParamsDto): ArchiveSearchResultDto {
        val context = coroutineScope.coroutineContext + Dispatchers.IO
        return withContext(context) {
            val archives = archiveRepository.search(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = searchParams.getStartDateAsInstant(),
                endDate = searchParams.getEndDateAsInstant(),
                limit = searchParams.pageSize,
                offset = searchParams.getOffset()
            )
            
            val totalCount = archiveRepository.countBySearchCriteria(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = searchParams.getStartDateAsInstant(),
                endDate = searchParams.getEndDateAsInstant()
            )
            
            ArchiveSearchResultDto(
                items = archives.map { ArchiveDto.fromDomain(it) },
                totalCount = totalCount,
                page = searchParams.page,
                pageSize = searchParams.pageSize,
                hasMore = (searchParams.getOffset() + archives.size) < totalCount
            )
        }
    }
    
    /**
     * 関連アーカイブ取得
     * @param id アーカイブID
     * @param limit 取得上限
     * @return アーカイブDTOのリスト
     */
    override suspend fun getRelatedArchives(id: String, limit: Int): List<ArchiveDto> {
        val context = coroutineScope.coroutineContext + Dispatchers.IO
        return withContext(context) {
            val archiveId = ArchiveId(id)
            val relatedArchives = archiveDomainService.findRelatedArchives(archiveId, limit)
            relatedArchives.map { ArchiveDto.fromDomain(it) }
        }
    }
}