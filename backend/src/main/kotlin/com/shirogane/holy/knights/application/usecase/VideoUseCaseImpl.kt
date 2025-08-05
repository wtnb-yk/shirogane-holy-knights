package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import com.shirogane.holy.knights.domain.repository.VideoRepository
import org.slf4j.LoggerFactory
import java.time.Instant

class VideoUseCaseImpl(
    private val videoRepository: VideoRepository
) : VideoUseCasePort {

    private val logger = LoggerFactory.getLogger(VideoUseCaseImpl::class.java)

    override suspend fun searchVideos(searchParams: VideoSearchParamsDto): VideoSearchResultDto {
        logger.info("動画検索実行: $searchParams")
        
        return try {
            val offset = (searchParams.page - 1) * searchParams.pageSize
            val startDate = searchParams.startDate?.let { Instant.parse(it) }
            val endDate = searchParams.endDate?.let { Instant.parse(it) }
            
            val videos = videoRepository.search(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate,
                limit = searchParams.pageSize,
                offset = offset
            )
            
            val totalCount = videoRepository.countBySearchCriteria(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate
            )

            val hasMore = (searchParams.page * searchParams.pageSize) < totalCount
            
            VideoSearchResultDto(
                items = videos.map { convertToDto(it) },
                totalCount = totalCount,
                page = searchParams.page,
                pageSize = searchParams.pageSize,
                hasMore = hasMore
            )
        } catch (e: Exception) {
            logger.error("動画検索エラー", e)
            VideoSearchResultDto(
                items = emptyList(),
                totalCount = 0,
                page = searchParams.page,
                pageSize = searchParams.pageSize,
                hasMore = false
            )
        }
    }

    private fun convertToDto(video: com.shirogane.holy.knights.domain.model.Video): VideoDto {
        return VideoDto(
            id = video.id.value,
            title = video.title,
            description = video.contentDetails?.description,
            publishedAt = video.publishedAt.toString(),
            duration = video.videoDetails?.duration?.value,
            thumbnailUrl = video.videoDetails?.thumbnailUrl,
            url = video.videoDetails?.url ?: "",
            tags = video.tags.map { it.name },
            channelId = video.channelId.value,
        )
    }
}
