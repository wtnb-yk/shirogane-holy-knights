package com.shirogane.holy.knights.application.usecase

import arrow.core.Either
import arrow.core.raise.either
import com.shirogane.holy.knights.adapter.controller.dto.StreamSongDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSongSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSongSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSongStatsDto
import com.shirogane.holy.knights.adapter.controller.port.SongUseCasePort
import com.shirogane.holy.knights.domain.repository.SongRepository
import org.springframework.stereotype.Service

@Service
class SongUseCaseImpl(
    private val songRepository: SongRepository
) : SongUseCasePort {

    override suspend fun searchStreamSongs(searchParams: StreamSongSearchParamsDto): Either<UseCaseError, StreamSongSearchResultDto> =
        either {
            val pageRequest = searchParams.toPageRequest()
            
            val songs = songRepository.searchStreamSongs(
                query = searchParams.query,
                sortBy = searchParams.sortBy ?: "singCount",
                sortOrder = searchParams.sortOrder ?: "DESC",
                startDate = searchParams.startDate,
                endDate = searchParams.endDate,
                frequencyCategories = searchParams.frequencyCategories,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )
            
            val totalCount = songRepository.countStreamSongs(
                query = searchParams.query,
                startDate = searchParams.startDate,
                endDate = searchParams.endDate,
                frequencyCategories = searchParams.frequencyCategories
            )

            val songsDto = songs.map { StreamSongDto.fromDomain(it) }
            StreamSongSearchResultDto.of(songsDto, totalCount, pageRequest)
        }

    override suspend fun getStreamSongsStats(): Either<UseCaseError, StreamSongStatsDto> =
        either {
            val stats = songRepository.getStreamSongsStats()
            StreamSongStatsDto.fromDomain(stats)
        }

    override suspend fun searchConcertSongs(searchParams: StreamSongSearchParamsDto): Either<UseCaseError, StreamSongSearchResultDto> =
        either {
            val pageRequest = searchParams.toPageRequest()
            
            val songs = songRepository.searchConcertSongs(
                query = searchParams.query,
                sortBy = searchParams.sortBy ?: "singCount",
                sortOrder = searchParams.sortOrder ?: "DESC",
                startDate = searchParams.startDate,
                endDate = searchParams.endDate,
                frequencyCategories = searchParams.frequencyCategories,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )
            
            val totalCount = songRepository.countConcertSongs(
                query = searchParams.query,
                startDate = searchParams.startDate,
                endDate = searchParams.endDate,
                frequencyCategories = searchParams.frequencyCategories
            )

            val songsDto = songs.map { StreamSongDto.fromDomain(it) }
            StreamSongSearchResultDto.of(songsDto, totalCount, pageRequest)
        }

    override suspend fun getConcertSongsStats(): Either<UseCaseError, StreamSongStatsDto> =
        either {
            val stats = songRepository.getConcertSongsStats()
            StreamSongStatsDto.fromDomain(stats)
        }
}
