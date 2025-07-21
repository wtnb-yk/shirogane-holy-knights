package com.shirogane.holy.knights.domain.model

import java.time.Instant

/**
 * 配信アーカイブドメインモデル
 * ドメイン層の中心的なエンティティ
 */
data class Archive(
    val id: ArchiveId,
    val title: String,
    val publishedAt: Instant,
    val videoDetails: VideoDetails? = null,
    val contentDetails: ContentDetails? = null,
    val tags: List<Tag> = emptyList()
)

/**
 * 動画詳細情報値オブジェクト
 */
data class VideoDetails(
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
 * アーカイブID値オブジェクト
 */
@JvmInline
value class ArchiveId(val value: String) {
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