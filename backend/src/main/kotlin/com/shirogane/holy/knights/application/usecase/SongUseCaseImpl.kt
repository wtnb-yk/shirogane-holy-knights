package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.common.PageResponse
import com.shirogane.holy.knights.application.dto.StreamSongDto
import com.shirogane.holy.knights.application.dto.StreamSongSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSongSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamSongStatsDto
import com.shirogane.holy.knights.application.port.`in`.SongUseCasePort
import com.shirogane.holy.knights.domain.repository.SongRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class SongUseCaseImpl(
    private val songRepository: SongRepository
) : SongUseCasePort {

    private val logger = LoggerFactory.getLogger(SongUseCaseImpl::class.java)

    override suspend fun searchStreamSongs(searchParams: StreamSongSearchParamsDto): StreamSongSearchResultDto {
        logger.info("楽曲検索実行: $searchParams")
        
        return try {
            val pageRequest = searchParams.toPageRequest()
            
            val songs = songRepository.searchStreamSongs(
                query = searchParams.query,
                sortBy = searchParams.sortBy ?: "singCount",
                sortOrder = searchParams.sortOrder ?: "DESC",
                startDate = searchParams.getStartDateAsInstant(),
                endDate = searchParams.getEndDateAsInstant(),
                limit = pageRequest.size,
                offset = pageRequest.offset
            )
            
            val totalCount = songRepository.countStreamSongs(
                query = searchParams.query,
                startDate = searchParams.getStartDateAsInstant(),
                endDate = searchParams.getEndDateAsInstant()
            )

            val songsDto = songs.map { StreamSongDto.fromDomain(it) }
            val pageResponse = PageResponse.of(songsDto, totalCount, pageRequest)
            
            StreamSongSearchResultDto(
                songs = pageResponse.content,
                totalCount = pageResponse.totalElements,
                totalPages = pageResponse.totalPages,
                currentPage = pageResponse.page
            )
        } catch (e: Exception) {
            logger.error("楽曲検索中にエラーが発生しました", e)
            StreamSongSearchResultDto(
                songs = emptyList(),
                totalCount = 0,
                totalPages = 0,
                currentPage = searchParams.page
            )
        }
    }

    override suspend fun getStreamSongsStats(): StreamSongStatsDto {
        logger.info("楽曲統計情報取得実行")
        
        return try {
            val stats = songRepository.getStreamSongsStats()
            StreamSongStatsDto.fromDomain(stats)
        } catch (e: Exception) {
            logger.error("楽曲統計情報取得中にエラーが発生しました", e)
            StreamSongStatsDto(
                totalSongs = 0,
                totalPerformances = 0,
                topSongs = emptyList(),
                recentPerformances = emptyList()
            )
        }
    }
}
