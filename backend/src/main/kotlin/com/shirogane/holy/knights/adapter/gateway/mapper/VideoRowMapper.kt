package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.*
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class VideoRowMapper : RowMapper<Video> {
    
    override fun map(row: Row): Video {
        val tags = parseTags(row.get("tags", String::class.java))
        
        return Video(
            id = ContentId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            publishedAt = row.get("published_at", Instant::class.java) 
                ?: row.get("created_at", Instant::class.java)!!,
            channelId = ChannelId(row.get("channel_id", String::class.java)!!),
            videoDetails = VideoDetailsVO(
                url = row.get("url", String::class.java) 
                    ?: "https://www.youtube.com/watch?v=${row.get("id", String::class.java)}",
                duration = row.get("duration", String::class.java)?.let { Duration(it) },
                thumbnailUrl = row.get("thumbnail_url", String::class.java)
            ),
            contentDetails = ContentDetails(
                description = row.get("description", String::class.java),
            ),
            tags = tags
        )
    }
    
    private fun parseTags(tagsString: String?): List<Tag> {
        return tagsString
            ?.split(",")
            ?.filter { it.isNotBlank() }
            ?.map { Tag(it.trim()) }
            ?: emptyList()
    }
}

@Component  
class StreamRowMapper : RowMapper<Stream> {
    
    override fun map(row: Row): Stream {
        val streamTags = parseStreamTags(row.get("stream_tags", String::class.java))
        
        return Stream(
            id = ContentId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            startedAt = row.get("started_at", Instant::class.java)!!,
            channelId = ChannelId(row.get("channel_id", String::class.java)!!),
            streamDetails = StreamDetailsVO(
                startedAt = row.get("started_at", Instant::class.java)
            ),
            contentDetails = ContentDetails(
                description = row.get("description", String::class.java),
            ),
            streamTags = streamTags
        )
    }
    
    private fun parseStreamTags(tagsString: String?): List<StreamTag> {
        return tagsString
            ?.split(",")
            ?.filter { it.isNotBlank() }
            ?.map { StreamTag(it.trim()) }
            ?: emptyList()
    }
}