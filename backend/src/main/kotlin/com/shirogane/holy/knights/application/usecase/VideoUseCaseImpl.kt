package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import com.shirogane.holy.knights.domain.model.VideoId
import com.shirogane.holy.knights.domain.repository.VideoRepository
import org.slf4j.LoggerFactory
import java.time.Instant

class VideoUseCaseImpl(
    private val videoRepository: VideoRepository
) : VideoUseCasePort {

    private val logger = LoggerFactory.getLogger(VideoUseCaseImpl::class.java)

    override suspend fun getAllVideos(page: Int, pageSize: Int): VideoSearchResultDto {
        logger.info("動画一覧取得: page=$page, pageSize=$pageSize")
        
        return try {
            val offset = (page - 1) * pageSize
            val videos = videoRepository.findAll(pageSize, offset)
            val totalCount = videoRepository.count()
            
            val hasMore = (page * pageSize) < totalCount
            
            VideoSearchResultDto(
                items = videos.map { convertToDto(it) },
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                hasMore = hasMore
            )
        } catch (e: Exception) {
            logger.error("動画一覧取得エラー", e)
            VideoSearchResultDto(
                items = emptyList(),
                totalCount = 0,
                page = page,
                pageSize = pageSize,
                hasMore = false
            )
        }
    }

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

    override suspend fun getVideoById(id: String): VideoDto? {
        logger.info("動画詳細取得: id=$id")
        
        return try {
            val video = videoRepository.findById(VideoId(id))
            video?.let { convertToDto(it) }
        } catch (e: Exception) {
            logger.error("動画詳細取得エラー: id=$id", e)
            null
        }
    }

    override suspend fun getRelatedVideos(id: String, limit: Int): List<VideoDto> {
        logger.info("関連動画取得: id=$id, limit=$limit")
        
        return try {
            val videos = videoRepository.getRelatedVideos(VideoId(id), limit)
            videos.map { convertToDto(it) }
        } catch (e: Exception) {
            logger.error("関連動画取得エラー: id=$id", e)
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
}
