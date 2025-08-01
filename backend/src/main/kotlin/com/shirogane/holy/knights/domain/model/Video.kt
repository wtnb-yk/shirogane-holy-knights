package com.shirogane.holy.knights.domain.model

import java.time.Instant

/**
 * 配信・動画ドメインモデル
 * ドメイン層の中心的なエンティティ
 */
data class Video(
    val id: VideoId,
    val title: String,
    val publishedAt: Instant,
    val channelId: ChannelId,
    val videoDetails: VideoDetailsVO? = null,
    val contentDetails: ContentDetails? = null,
    val tags: List<Tag> = emptyList()
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
 * コンテンツ詳細情報値オブジェクト
 */
data class ContentDetails(
    val description: String? = null,
    val isMembersOnly: Boolean = false
)

/**
 * 動画ID値オブジェクト
 */
@JvmInline
value class VideoId(val value: String) {
    override fun toString(): String = value
}

/**
 * チャンネルID値オブジェクト
 */
@JvmInline
value class ChannelId(val value: String) {
    override fun toString(): String = value
}

/**
 * タグ値オブジェクト
 */
@JvmInline
value class Tag(val name: String) {
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
