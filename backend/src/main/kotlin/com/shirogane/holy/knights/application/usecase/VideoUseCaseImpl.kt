package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.common.PageResponse
import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamDto
import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import com.shirogane.holy.knights.domain.repository.VideoRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class VideoUseCaseImpl(
    private val videoRepository: VideoRepository
) : VideoUseCasePort {

    private val logger = LoggerFactory.getLogger(VideoUseCaseImpl::class.java)

    override suspend fun searchVideos(searchParams: VideoSearchParamsDto): VideoSearchResultDto {
        logger.info("動画検索実行: $searchParams")
        
        return try {
            val pageRequest = searchParams.toPageRequest()
            val startDate = searchParams.startDate?.let { Instant.parse(it) }
            val endDate = searchParams.endDate?.let { Instant.parse(it) }
            
            val videos = videoRepository.search(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )
            
            val totalCount = videoRepository.countVideosBySearchCriteria(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate
            )

            val videosDto = videos.map { convertToDto(it) }
            val pageResponse = PageResponse.of(videosDto, totalCount, pageRequest)
            
            VideoSearchResultDto(
                items = pageResponse.content,
                totalCount = pageResponse.totalElements,
                page = pageResponse.page,
                pageSize = pageResponse.size,
                hasMore = pageResponse.hasMore
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
            val pageRequest = searchParams.toPageRequest()
            val startDate = searchParams.startDate?.let { Instant.parse(it) }
            val endDate = searchParams.endDate?.let { Instant.parse(it) }
            
            val streams = videoRepository.searchStreams(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )
            
            val totalCount = videoRepository.countStreamsBySearchCriteria(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate
            )

            val streamsDto = streams.map { convertToStreamDto(it) }
            val pageResponse = PageResponse.of(streamsDto, totalCount, pageRequest)
            
            StreamSearchResultDto(
                items = pageResponse.content,
                totalCount = pageResponse.totalElements,
                page = pageResponse.page,
                pageSize = pageResponse.size,
                hasMore = pageResponse.hasMore
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

    override suspend fun getAllStreamTags(): List<String> {
        logger.info("全配信タグ取得実行")
        
        return try {
            videoRepository.getAllStreamTags()
        } catch (e: Exception) {
            logger.error("全配信タグ取得エラー", e)
            emptyList()
        }
    }

    override suspend fun getAllVideoTags(): List<String> {
        logger.info("全動画タグ取得実行")
        
        return try {
            videoRepository.getAllVideoTags()
        } catch (e: Exception) {
            logger.error("全動画タグ取得エラー", e)
            emptyList()
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
            tags = video.streamTags.map { it.name },
            channelId = video.channelId.value,
        )
    }
}
