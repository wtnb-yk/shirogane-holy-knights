package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.*
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.LocalDate

/**
 * アルバム関連のRowMapper
 * CalendarRowMapperと同じパターンで実装
 */
@Component
class AlbumRowMapper : RowMapper<Album> {

    override fun map(row: Row): Album {
        val albumType = AlbumType(
            id = row.get("album_type_id", Integer::class.java)!!.toInt(),
            name = row.get("album_type_name", String::class.java) ?: "UNKNOWN",
            description = row.get("album_type_description", String::class.java)
        )

        val tracks = parseTracks(row.get("tracks", String::class.java) ?: "")
        val albumReleases = parseAlbumReleases(row.get("music_releases", String::class.java) ?: "")

        return Album(
            id = AlbumId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            artist = row.get("artist", String::class.java)!!,
            albumType = albumType,
            releaseDate = row.get("release_date", LocalDate::class.java),
            coverImageUrl = row.get("cover_image_url", String::class.java),
            tracks = tracks,
            albumReleases = albumReleases
        )
    }

    private fun parseTracks(tracksStr: String): List<AlbumTrack> {
        if (tracksStr.isEmpty()) return emptyList()

        return tracksStr.split("|")
            .filter { it.isNotBlank() }
            .mapNotNull { trackStr ->
                val parts = trackStr.split(":")
                if (parts.size >= 4) {
                    try {
                        AlbumTrack(
                            songId = SongId(parts[0]),
                            title = parts[1],
                            artist = parts[2],
                            trackNumber = parts[3].toInt()
                        )
                    } catch (e: Exception) {
                        null
                    }
                } else {
                    null
                }
            }
    }

    private fun parseAlbumReleases(releasesStr: String): List<AlbumRelease> {
        if (releasesStr.isEmpty()) return emptyList()

        return releasesStr.split("|")
            .filter { it.isNotBlank() }
            .mapNotNull { releaseStr ->
                val parts = releaseStr.split(":")
                if (parts.size >= 5) {
                    try {
                        AlbumRelease(
                            id = AlbumReleaseId(parts[0]),
                            platformName = parts[1],
                            platformUrl = parts[2],
                            platformIconUrl = if (parts[3].isNotBlank()) parts[3] else null,
                            releaseDate = LocalDate.parse(parts[4])
                        )
                    } catch (e: Exception) {
                        null
                    }
                } else {
                    null
                }
            }
    }
}