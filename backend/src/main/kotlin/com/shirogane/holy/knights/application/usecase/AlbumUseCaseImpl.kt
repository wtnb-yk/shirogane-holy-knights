package com.shirogane.holy.knights.application.usecase

import arrow.core.Either
import arrow.core.raise.either
import com.shirogane.holy.knights.adapter.controller.dto.AlbumDto
import com.shirogane.holy.knights.adapter.controller.dto.AlbumSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.AlbumSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.AlbumTypeDto
import com.shirogane.holy.knights.adapter.controller.port.AlbumUseCasePort
import com.shirogane.holy.knights.domain.model.AlbumId
import com.shirogane.holy.knights.domain.repository.AlbumRepository
import org.springframework.stereotype.Service

@Service
class AlbumUseCaseImpl(
    private val albumRepository: AlbumRepository
) : AlbumUseCasePort {

    override suspend fun searchAlbums(params: AlbumSearchParamsDto): Either<UseCaseError, AlbumSearchResultDto> =
        either {
            val pageRequest = params.toPageRequest()
            val startDate = params.getStartDateAsLocalDate()
            val endDate = params.getEndDateAsLocalDate()

            val albums = albumRepository.search(
                query = params.query,
                albumTypes = params.albumTypes,
                startDate = startDate,
                endDate = endDate,
                sortBy = params.sortBy,
                sortOrder = params.sortOrder,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )

            val totalCount = albumRepository.countBySearchCriteria(
                query = params.query,
                albumTypes = params.albumTypes,
                startDate = startDate,
                endDate = endDate
            )

            val albumDto = albums.map { AlbumDto.fromDomain(it) }
            AlbumSearchResultDto.of(albumDto, totalCount, pageRequest)
        }

    override suspend fun getAlbumDetails(albumId: String): Either<UseCaseError, AlbumDto> =
        either {
            val album = albumRepository.findById(AlbumId(albumId))
                ?: raise(UseCaseError(message = "指定されたアルバムが見つかりません"))

            AlbumDto.fromDomain(album)
        }

    override suspend fun getAllAlbumTypes(): List<AlbumTypeDto> {
        val albumTypes = albumRepository.findAllAlbumTypes()
        return albumTypes.map { AlbumTypeDto.fromDomain(it) }
    }
}
