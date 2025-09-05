package com.shirogane.holy.knights.domain.model

import java.time.Instant
import java.util.*

/**
 * 楽曲ドメインモデル
 * 配信・コンサートで歌われた楽曲の情報を表現
 */
data class Song(
    val id: SongId,
    val title: String,
    val artist: String,
    val singCount: Int = 0,
    val latestSingDate: Instant? = null,
    val performances: List<Performance> = emptyList()
)

/**
 * 楽曲パフォーマンス（歌唱記録）
 * stream_songsまたはconcert_songsテーブルの情報を表現
 */
data class Performance(
    val videoId: ContentId,
    val videoTitle: String,
    val performanceType: PerformanceType,
    val url: String,
    val startSeconds: Int,
    val performedAt: Instant,
    val streamSongUrl: String
)

/**
 * パフォーマンス種別
 */
enum class PerformanceType {
    STREAM, CONCERT
}

/**
 * 歌唱回数カテゴリ
 */
enum class SingFrequencyCategory {
    LOW,        // 1-2回
    MEDIUM,     // 3-5回
    HIGH,       // 6-10回
    VERY_HIGH   // 11回以上
}

/**
 * 楽曲統計情報
 */
data class SongStats(
    val totalSongs: Int,
    val totalPerformances: Int,
    val topSongs: List<TopSongStats>,
    val recentPerformances: List<RecentPerformanceStats>
)

/**
 * 上位楽曲統計
 */
data class TopSongStats(
    val songId: SongId,
    val title: String,
    val artist: String,
    val singCount: Int
)

/**
 * 最新歌唱統計
 */
data class RecentPerformanceStats(
    val songId: SongId,
    val title: String,
    val artist: String,
    val latestPerformance: Instant,
    val latestContentId: ContentId,
    val latestVideoTitle: String,
    val latestVideoUrl: String
)

/**
 * 楽曲ID値オブジェクト
 */
class Songs(private val listUnordered: List<Song>): FCC<Song>(
    listUnordered.sortedWith(compareByDescending{ it.latestSingDate })
)

@JvmInline
value class SongId(val value: UUID) {
    constructor(value: String) : this(UUID.fromString(value))
    override fun toString(): String = value.toString()
}
