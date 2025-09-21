package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.application.common.PaginatedResult
import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable
import java.time.LocalDate

/**
 * アルバムDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class AlbumDto(
    val id: String,
    val title: String,
    val artist: String,
    val albumType: AlbumTypeDto,
    val releaseDate: String?, // YYYY-MM-DD形式
    val coverImageUrl: String? = null,
    val trackCount: Int? = null,
    val tracks: List<AlbumTrackDto>? = null,
    val albumReleases: List<AlbumReleaseDto>? = null
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(album: Album): AlbumDto {
            return AlbumDto(
                id = album.id.value,
                title = album.title,
                artist = album.artist,
                albumType = AlbumTypeDto.fromDomain(album.albumType),
                releaseDate = album.releaseDate?.toString(), // YYYY-MM-DD
                coverImageUrl = album.coverImageUrl,
                trackCount = album.tracks?.size,
                tracks = album.tracks?.map { AlbumTrackDto.fromDomain(it) },
                albumReleases = album.albumReleases?.map { AlbumReleaseDto.fromDomain(it) }
            )
        }
    }
}

/**
 * アルバムトラックDTO
 */
@Serializable
data class AlbumTrackDto(
    val songId: String,
    val title: String,
    val artist: String,
    val trackNumber: Int
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(track: AlbumTrack): AlbumTrackDto {
            return AlbumTrackDto(
                songId = track.songId.value.toString(),
                title = track.title,
                artist = track.artist,
                trackNumber = track.trackNumber
            )
        }
    }
}

/**
 * アルバムリリースDTO
 */
@Serializable
data class AlbumReleaseDto(
    val id: String,
    val platformName: String,
    val platformUrl: String,
    val platformIconUrl: String? = null,
    val releaseDate: String // YYYY-MM-DD形式
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(release: AlbumRelease): AlbumReleaseDto {
            return AlbumReleaseDto(
                id = release.id.value,
                platformName = release.platformName,
                platformUrl = release.platformUrl,
                platformIconUrl = release.platformIconUrl,
                releaseDate = release.releaseDate.toString() // YYYY-MM-DD
            )
        }
    }
}

/**
 * アルバムタイプDTO
 */
@Serializable
data class AlbumTypeDto(
    val id: Int,
    val typeName: String,
    val description: String? = null
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(albumType: AlbumType): AlbumTypeDto {
            return AlbumTypeDto(
                id = albumType.id,
                typeName = albumType.name,
                description = albumType.description
            )
        }
    }
}

/**
 * アルバム検索パラメータDTO
 */
data class AlbumSearchParamsDto(
    val query: String? = null,
    val albumTypes: List<String>? = null,
    val startDate: String? = null, // YYYY-MM-DD形式
    val endDate: String? = null,   // YYYY-MM-DD形式
    val sortBy: String = "releaseDate",
    val sortOrder: String = "DESC",
    val page: Int = 1,
    val pageSize: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = PageRequest(page, pageSize)

    /**
     * 開始日をLocalDateに変換
     */
    fun getStartDateAsLocalDate(): LocalDate? {
        return startDate?.let { LocalDate.parse(it) }
    }

    /**
     * 終了日をLocalDateに変換
     */
    fun getEndDateAsLocalDate(): LocalDate? {
        return endDate?.let { LocalDate.parse(it) }
    }
}

/**
 * アルバム検索結果DTO
 */
@Serializable
data class AlbumSearchResultDto(
    override val items: List<AlbumDto>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int
) : PaginatedResult<AlbumDto> {
    companion object {
        fun of(items: List<AlbumDto>, totalCount: Int, pageRequest: PageRequest): AlbumSearchResultDto {
            return AlbumSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size
            )
        }
    }
}
