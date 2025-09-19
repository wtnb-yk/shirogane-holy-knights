package com.shirogane.holy.knights.adapter.gateway.entity

import com.shirogane.holy.knights.domain.model.*
import java.time.LocalDate

/**
 * アルバムエンティティ
 * データベースのalbumsテーブルとのマッピング用
 */
data class AlbumEntity(
    val id: String,
    val title: String,
    val artist: String,
    val albumTypeId: Int,
    val releaseDate: LocalDate?,
    val coverImageUrl: String?,
    val albumType: AlbumTypeEntity? = null,
    val tracks: List<AlbumTrackEntity> = emptyList(),
    val musicReleases: List<MusicReleaseEntity> = emptyList()
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): Album {
        return Album(
            id = AlbumId(id),
            title = title,
            artist = artist,
            albumType = albumType?.toDomain() ?: AlbumType(albumTypeId, "UNKNOWN"),
            releaseDate = releaseDate,
            coverImageUrl = coverImageUrl,
            tracks = tracks.map { it.toDomain() },
            musicReleases = musicReleases.map { it.toDomain() }
        )
    }
}

/**
 * アルバムタイプエンティティ
 * データベースのalbum_typesテーブルとのマッピング用
 */
@org.springframework.data.relational.core.mapping.Table("album_types")
data class AlbumTypeEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val typeName: String,
    val description: String? = null
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): AlbumType {
        return AlbumType(
            id = id,
            name = typeName,
            description = description
        )
    }
}

/**
 * アルバムトラックエンティティ
 * データベースのalbum_songsテーブルとのマッピング用
 */
data class AlbumTrackEntity(
    val songId: String,
    val title: String,
    val artist: String,
    val trackNumber: Int
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): AlbumTrack {
        return AlbumTrack(
            songId = SongId(songId),
            title = title,
            artist = artist,
            trackNumber = trackNumber
        )
    }
}

/**
 * 音楽リリースエンティティ
 * データベースのmusic_releasesテーブルとのマッピング用
 */
data class MusicReleaseEntity(
    val id: String,
    val platformName: String,
    val platformUrl: String,
    val platformIconUrl: String? = null,
    val releaseDate: LocalDate
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): MusicRelease {
        return MusicRelease(
            id = MusicReleaseId(id),
            platformName = platformName,
            platformUrl = platformUrl,
            platformIconUrl = platformIconUrl,
            releaseDate = releaseDate
        )
    }
}