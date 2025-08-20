package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.PerformedSongDto
import com.shirogane.holy.knights.application.dto.PerformedSongSearchParamsDto
import com.shirogane.holy.knights.application.dto.PerformedSongSearchResultDto
import com.shirogane.holy.knights.application.dto.PerformedSongStatsDto
import com.shirogane.holy.knights.application.port.`in`.SongUseCasePort
import com.shirogane.holy.knights.domain.repository.SongRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class SongUseCaseImpl(
    private val songRepository: SongRepository
) : SongUseCasePort {

    private val logger = LoggerFactory.getLogger(SongUseCaseImpl::class.java)

    override suspend fun searchPerformedSongs(searchParams: PerformedSongSearchParamsDto): PerformedSongSearchResultDto {
        logger.info("楽曲検索実行: $searchParams")
        
        return try {
            val offset = searchParams.getOffset()
            
            val songs = songRepository.searchPerformedSongs(
                query = searchParams.query,
                sortBy = searchParams.sortBy ?: "singCount",
                sortOrder = searchParams.sortOrder ?: "DESC",
                limit = searchParams.size,
                offset = offset
            )
            
            val totalCount = songRepository.countPerformedSongs(
                query = searchParams.query
            )

            val totalPages = (totalCount + searchParams.size - 1) / searchParams.size
            
            PerformedSongSearchResultDto(
                songs = songs.map { PerformedSongDto.fromDomain(it) },
                totalCount = totalCount,
                totalPages = totalPages,
                currentPage = searchParams.page
            )
        } catch (e: Exception) {
            logger.error("楽曲検索中にエラーが発生しました", e)
            PerformedSongSearchResultDto(
                songs = emptyList(),
                totalCount = 0,
                totalPages = 0,
                currentPage = searchParams.page
            )
        }
    }

    override suspend fun getPerformedSongsStats(): PerformedSongStatsDto {
        logger.info("楽曲統計情報取得実行")
        
        return try {
            val stats = songRepository.getPerformedSongsStats()
            PerformedSongStatsDto.fromDomain(stats)
        } catch (e: Exception) {
            logger.error("楽曲統計情報取得中にエラーが発生しました", e)
            PerformedSongStatsDto(
                totalSongs = 0,
                totalPerformances = 0,
                topSongs = emptyList(),
                recentPerformances = emptyList()
            )
        }
    }
}