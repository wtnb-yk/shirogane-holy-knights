package com.shirogane.holy.knights.adapter.gateway.mapper

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.domain.model.*
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.*

@Component
class SongRowMapper(
    private val objectMapper: ObjectMapper
) : RowMapper<Song> {
    
    override fun map(row: Row): Song {
        val performances = parsePerformances(row.get("performances", Array<String>::class.java) ?: arrayOf())
        
        return Song(
            id = SongId(row.get("song_id", UUID::class.java)!!),
            title = row.get("title", String::class.java)!!,
            artist = row.get("artist", String::class.java)!!,
            singCount = (row.get("sing_count") as Number).toInt(),
            latestSingDate = row.get("latest_sing_date", Instant::class.java),
            performances = performances
        )
    }
    
    private fun parsePerformances(performancesArray: Array<String>): List<Performance> {
        return performancesArray.mapNotNull { jsonString ->
            try {
                val jsonNode = objectMapper.readTree(jsonString)
                Performance(
                    videoId = VideoId(jsonNode.get("video_id").asText()),
                    videoTitle = jsonNode.get("video_title").asText() ?: "",
                    performanceType = PerformanceType.valueOf(jsonNode.get("performance_type").asText()),
                    url = jsonNode.get("url").asText() ?: "",
                    startSeconds = jsonNode.get("start_seconds").asInt(0),
                    performedAt = Instant.parse(jsonNode.get("performed_at").asText() + "Z"),
                    streamSongUrl = jsonNode.get("stream_song_url").asText() ?: ""
                )
            } catch (e: Exception) {
                null
            }
        }
    }
}