package com.shirogane.holy.knights.domain.model

import java.time.Instant

@JvmInline
value class ContentId(val value: String) {
    override fun toString(): String = value
}

sealed class Content {
    abstract val id: ContentId
    abstract val title: String
    abstract val channelId: ChannelId
    abstract val contentDetails: ContentDetails?
}

data class Video(
    override val id: ContentId,
    override val title: String,
    val publishedAt: Instant,
    override val channelId: ChannelId,
    val videoDetails: VideoDetailsVO? = null,
    override val contentDetails: ContentDetails? = null,
    val tags: List<Tag> = emptyList()
) : Content()

data class Stream(
    override val id: ContentId,
    override val title: String,
    val startedAt: Instant,
    override val channelId: ChannelId,
    val streamDetails: StreamDetailsVO? = null,
    override val contentDetails: ContentDetails? = null,
    val streamTags: List<StreamTag> = emptyList()
) : Content()

class Videos(private val listUnordered: List<Video>): FCC<Video>(
    listUnordered.sortedByDescending{ it.publishedAt }
)

class Streams(private val listUnordered: List<Stream>): FCC<Stream>(
    listUnordered.sortedByDescending{ it.startedAt }
)

/**
 * 動画詳細情報値オブジェクト
 */
data class VideoDetailsVO(
    val url: String,
    val duration: Duration? = null,
    val thumbnailUrl: String? = null
)

/**
 * 配信詳細情報値オブジェクト
 */
data class StreamDetailsVO(
    val startedAt: Instant? = null,
    val duration: Duration? = null,
    val thumbnailUrl: String? = null,
    val url: String? = null
)

/**
 * コンテンツ詳細情報値オブジェクト
 */
data class ContentDetails(
    val description: String? = null,
)


/**
 * チャンネルID値オブジェクト
 */
@JvmInline
value class ChannelId(val value: String) {
    override fun toString(): String = value
}

/**
 * 動画タグ値オブジェクト
 */
@JvmInline
value class Tag(val name: String) {
    override fun toString(): String = name
}

/**
 * 配信タグ値オブジェクト
 */
@JvmInline
value class StreamTag(val name: String) {
    override fun toString(): String = name
}

/**
 * 動画時間（HH:MM:SS形式）値オブジェクト
 */
@JvmInline
value class Duration(val value: String) {
    init {
        require(value.matches(Regex("\\d{2}:\\d{2}:\\d{2}"))) {
            "動画時間は「HH:MM:SS」形式である必要があります"
        }
    }
    
    override fun toString(): String = value
}
