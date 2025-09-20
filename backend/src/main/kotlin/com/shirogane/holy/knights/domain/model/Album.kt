package com.shirogane.holy.knights.domain.model

import java.time.LocalDate

/**
 * アルバムドメインモデル
 * 音楽アルバムの情報を表現
 */
data class Album(
    val id: AlbumId,
    val title: String,
    val artist: String,
    val albumType: AlbumType,
    val releaseDate: LocalDate?,
    val coverImageUrl: String? = null,
    val tracks: List<AlbumTrack>? = null,
    val albumReleases: List<AlbumRelease>? = null
)

/**
 * アルバムコレクション
 */
class Albums(albums: List<Album>) : FCC<Album>(
    albums.sortedWith(compareByDescending<Album> { it.releaseDate }.thenBy { it.title })
)

/**
 * アルバムID値オブジェクト
 */
@JvmInline
value class AlbumId(val value: String) {
    override fun toString(): String = value
}

/**
 * アルバムタイプ値オブジェクト
 */
data class AlbumType(
    val id: Int,
    val name: String,
    val description: String? = null
)

/**
 * アルバムトラック
 */
data class AlbumTrack(
    val songId: SongId,
    val title: String,
    val artist: String,
    val trackNumber: Int
)

/**
 * アルバムリリース
 */
data class AlbumRelease(
    val id: AlbumReleaseId,
    val platformName: String,
    val platformUrl: String,
    val platformIconUrl: String? = null,
    val releaseDate: LocalDate
)

/**
 * アルバムリリースID値オブジェクト
 */
@JvmInline
value class AlbumReleaseId(val value: String) {
    override fun toString(): String = value
}
