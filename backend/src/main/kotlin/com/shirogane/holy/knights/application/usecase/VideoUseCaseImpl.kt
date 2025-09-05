package com.shirogane.holy.knights.application.usecase

import arrow.core.Either
import arrow.core.raise.either
import com.shirogane.holy.knights.adapter.controller.dto.VideoDto
import com.shirogane.holy.knights.adapter.controller.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.VideoSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSearchResultDto
import com.shirogane.holy.knights.adapter.controller.port.VideoUseCasePort
import com.shirogane.holy.knights.domain.model.Video
import com.shirogane.holy.knights.domain.model.Videos
import com.shirogane.holy.knights.domain.model.Stream
import com.shirogane.holy.knights.domain.model.Streams
import com.shirogane.holy.knights.domain.repository.VideoRepository
import org.springframework.stereotype.Service

@Service
class VideoUseCaseImpl(
    private val videoRepository: VideoRepository
) : VideoUseCasePort {

    override suspend fun searchVideos(searchParams: VideoSearchParamsDto): Either<UseCaseError, VideoSearchResultDto> =
        either {
            val pageRequest = searchParams.toPageRequest()
            val startDate = searchParams.startDate
            val endDate = searchParams.endDate

            // TODO: Repositoryのエラーを拾う
            val videos = videoRepository.searchVideos(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )

            val totalCount = videoRepository.countVideos(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate
            )

            val videosDto = videos.convertToDto()
            VideoSearchResultDto.of(videosDto, totalCount, pageRequest)
        }

    override suspend fun searchStreams(searchParams: StreamSearchParamsDto): Either<UseCaseError, StreamSearchResultDto> =
        either {
            val pageRequest = searchParams.toPageRequest()
            val startDate = searchParams.startDate
            val endDate = searchParams.endDate

            val streams = videoRepository.searchStreams(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )

            val totalCount = videoRepository.countStreams(
                query = searchParams.query,
                tags = searchParams.tags,
                startDate = startDate,
                endDate = endDate
            )

            val streamsDto = streams.convertToStreamDto()
            StreamSearchResultDto.of(streamsDto, totalCount, pageRequest)
        }


    override suspend fun getAllStreamTags(): List<String> =
        videoRepository.getAllStreamTags()

    override suspend fun getAllVideoTags(): List<String> =
        videoRepository.getAllVideoTags()

    private fun Videos.convertToDto(): List<VideoDto> = this.map { video -> convertToDto(video) }
    private fun convertToDto(video: Video): VideoDto =
        VideoDto(
            id = video.id.value,
            title = video.title,
            description = video.contentDetails?.description,
            publishedAt = video.publishedAt.toString(),
            duration = video.videoDetails?.duration?.value,
            thumbnailUrl = video.videoDetails?.thumbnailUrl,
            url = video.videoDetails?.url ?: "https://www.youtube.com/watch?v=${video.id.value}",
            tags = video.tags.map { it.name },
            channelId = video.channelId.value,
        )

    private fun Streams.convertToStreamDto(): List<StreamDto> = this.map { stream -> convertToStreamDto(stream) }
    private fun convertToStreamDto(stream: Stream): StreamDto {
        return StreamDto(
            id = stream.id.value,
            title = stream.title,
            description = stream.contentDetails?.description,
            startedAt = stream.startedAt.toString(),
            duration = stream.streamDetails?.duration?.value,
            thumbnailUrl = stream.streamDetails?.thumbnailUrl,
            url = stream.streamDetails?.url ?: "https://www.youtube.com/watch?v=${stream.id.value}",
            tags = stream.streamTags.map { it.name },
            channelId = stream.channelId.value,
        )
    }
}
