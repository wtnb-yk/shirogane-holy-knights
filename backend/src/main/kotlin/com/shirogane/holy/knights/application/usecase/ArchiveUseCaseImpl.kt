package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.ArchiveDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import com.shirogane.holy.knights.domain.model.ArchiveId
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import org.slf4j.LoggerFactory
import java.time.Instant

class ArchiveUseCaseImpl(
    private val archiveRepository: ArchiveRepository
) : ArchiveUseCasePort {

    private val logger = LoggerFactory.getLogger(ArchiveUseCaseImpl::class.java)

    override fun getAllArchives(page: Int, pageSize: Int): ArchiveSearchResultDto {
        logger.info("アーカイブ一覧取得: page=$page, pageSize=$pageSize")
        
        return try {
            val offset = (page - 1) * pageSize
            val archives = archiveRepository.findAll(pageSize, offset)
            val totalCount = archiveRepository.count()
            
            val hasMore = (page * pageSize) < totalCount
            
            ArchiveSearchResultDto(
                items = archives.map { convertToDto(it) },
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                hasMore = hasMore
            )
        } catch (e: Exception) {
            logger.error("アーカイブ一覧取得エラー", e)
            ArchiveSearchResultDto(
                items = emptyList(),
                totalCount = 0,
                page = page,
                pageSize = pageSize,
                hasMore = false
            )
        }
    }

    override suspend fun searchArchives(params: ArchiveSearchParamsDto): ArchiveSearchResultDto {
        logger.info("アーカイブ検索実行: $params")
        
        return try {
            val offset = (params.page - 1) * params.pageSize
            val startDate = params.startDate?.let { Instant.parse(it) }
            val endDate = params.endDate?.let { Instant.parse(it) }
            
            val archives = archiveRepository.search(
                query = params.query,
                tags = params.tags,
                startDate = startDate,
                endDate = endDate,
                limit = params.pageSize,
                offset = offset
            )
            
            val totalCount = archiveRepository.countBySearchCriteria(
                query = params.query,
                tags = params.tags,
                startDate = startDate,
                endDate = endDate
            )
            
            val hasMore = (params.page * params.pageSize) < totalCount
            
            ArchiveSearchResultDto(
                items = archives.map { convertToDto(it) },
                totalCount = totalCount,
                page = params.page,
                pageSize = params.pageSize,
                hasMore = hasMore
            )
        } catch (e: Exception) {
            logger.error("アーカイブ検索エラー", e)
            ArchiveSearchResultDto(
                items = emptyList(),
                totalCount = 0,
                page = params.page,
                pageSize = params.pageSize,
                hasMore = false
            )
        }
    }

    override suspend fun getArchiveById(id: String): ArchiveDto? {
        logger.info("アーカイブ詳細取得: id=$id")
        
        return try {
            val archive = archiveRepository.findById(ArchiveId(id))
            archive?.let { convertToDto(it) }
        } catch (e: Exception) {
            logger.error("アーカイブ詳細取得エラー: id=$id", e)
            null
        }
    }

    override suspend fun getRelatedArchives(id: String, limit: Int): List<ArchiveDto> {
        logger.info("関連アーカイブ取得: id=$id, limit=$limit")
        
        return try {
            val archives = archiveRepository.getRelatedArchives(ArchiveId(id), limit)
            archives.map { convertToDto(it) }
        } catch (e: Exception) {
            logger.error("関連アーカイブ取得エラー: id=$id", e)
            emptyList()
        }
    }

    private fun convertToDto(archive: com.shirogane.holy.knights.domain.model.Archive): ArchiveDto {
        return ArchiveDto(
            id = archive.id.value,
            title = archive.title,
            description = archive.contentDetails?.description,
            publishedAt = archive.publishedAt.toString(),
            duration = archive.videoDetails?.duration?.value,
            thumbnailUrl = archive.videoDetails?.thumbnailUrl,
            url = archive.videoDetails?.url ?: "",
            tags = archive.tags.map { it.name },
            channelId = archive.channelId.value,
            isMembersOnly = archive.contentDetails?.isMembersOnly ?: false
        )
    }
}