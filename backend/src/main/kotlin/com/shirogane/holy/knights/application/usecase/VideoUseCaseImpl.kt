package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamDto
import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSearchResultDto
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
            
            val totalCount = videoRepository.countVideosBySearchCriteria(
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

    override suspend fun searchStreams(searchParams: StreamSearchParamsDto): StreamSearchResultDto {
        logger.info("配信検索実行: $searchParams")
        
        return try {
            val offset = (searchParams.page - 1) * searchParams.pageSize
            val startDate = searchParams.startDate?.let { Instant.parse(it) }
            val endDate = searchParams.endDate?.let { Instant.parse(it) }
            
            val streams = videoRepository.searchStreams(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate,
                limit = searchParams.pageSize,
                offset = offset
            )
            
            val totalCount = videoRepository.countStreamsBySearchCriteria(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate
            )

            val hasMore = (searchParams.page * searchParams.pageSize) < totalCount
            
            StreamSearchResultDto(
                items = streams.map { convertToStreamDto(it) },
                totalCount = totalCount,
                page = searchParams.page,
                pageSize = searchParams.pageSize,
                hasMore = hasMore
            )
        } catch (e: Exception) {
            logger.error("配信検索エラー", e)
            StreamSearchResultDto(
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

    private fun convertToStreamDto(video: com.shirogane.holy.knights.domain.model.Video): StreamDto {
        return StreamDto(
            id = video.id.value,
            title = video.title,
            description = video.contentDetails?.description,
            startedAt = video.streamDetails?.startedAt?.toString(),
            duration = video.videoDetails?.duration?.value,
            thumbnailUrl = video.videoDetails?.thumbnailUrl,
            url = video.videoDetails?.url ?: "https://www.youtube.com/watch?v=${video.id.value}",
            tags = video.tags.map { it.name },
            channelId = video.channelId.value,
        )
    }
}
