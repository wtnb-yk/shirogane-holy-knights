package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.dto.AlbumSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.port.AlbumUseCasePort
import org.springframework.stereotype.Component

@Component
class AlbumController(
    private val albumUseCase: AlbumUseCasePort,
    override val objectMapper: ObjectMapper
) : Controller {

    suspend fun searchAlbums(requestBody: String?) =
        albumUseCase.searchAlbums(parseRequestBody(requestBody, AlbumSearchParamsDto::class.java) ?: AlbumSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )

    suspend fun getAlbumDetails(albumId: String) =
        albumUseCase.getAlbumDetails(albumId)
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )

    suspend fun getAllAlbumTypes() =
        ApiResponse(200, albumUseCase.getAllAlbumTypes())
}