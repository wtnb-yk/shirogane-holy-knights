package com.shirogane.holy.knights.adapter.gateway

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.SongRepository
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Repository
import org.springframework.r2dbc.core.awaitSingle
import java.time.Instant
import java.util.*

@Repository
class SongRepositoryImpl(
    private val template: R2dbcEntityTemplate
) : SongRepository {

    private val logger = LoggerFactory.getLogger(SongRepositoryImpl::class.java)
    private val objectMapper = ObjectMapper()

    override suspend fun searchPerformedSongs(
        query: String?,
        sortBy: String,
        sortOrder: String,
        limit: Int,
        offset: Int
    ): List<Song> {
        logger.info("楽曲検索: query=$query, sortBy=$sortBy, sortOrder=$sortOrder")
        
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()

        query?.let {
            conditions.add("(title ILIKE :query OR artist ILIKE :query)")
            bindings["query"] = "%$it%"
        }

        val whereClause = if (conditions.isNotEmpty()) {
            "WHERE " + conditions.joinToString(" AND ")
        } else ""

        val orderByClause = when (sortBy) {
            "singCount" -> "ORDER BY sing_count $sortOrder"
            "latestSingDate" -> "ORDER BY latest_sing_date $sortOrder"
            "title" -> "ORDER BY s.title $sortOrder"
            else -> "ORDER BY sing_count $sortOrder"
        }

        bindings["limit"] = limit
        bindings["offset"] = offset

        val sql = """
            WITH song_performances AS (
                SELECT 
                    s.id as song_id,
                    s.title,
                    s.artist,
                    COUNT(*) as sing_count,
                    MAX(COALESCE(sd.started_at, cs.created_at)) as latest_sing_date,
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'video_id', COALESCE(ss.video_id, cs.video_id),
                            'video_title', v.title,
                            'performance_type', CASE WHEN ss.video_id IS NOT NULL THEN 'STREAM' ELSE 'CONCERT' END,
                            'url', v.url,
                            'start_seconds', COALESCE(ss.start_seconds, cs.start_seconds),
                            'performed_at', COALESCE(sd.started_at, cs.created_at),
                            'stream_song_url', 
                            CASE 
                                WHEN COALESCE(ss.start_seconds, cs.start_seconds) > 0 
                                THEN v.url || '&t=' || COALESCE(ss.start_seconds, cs.start_seconds) || 's'
                                ELSE v.url 
                            END
                        ) ORDER BY COALESCE(sd.started_at, cs.created_at) DESC
                    ) as performances
                FROM songs s
                LEFT JOIN stream_songs ss ON s.id = ss.song_id
                LEFT JOIN concert_songs cs ON s.id = cs.song_id
                LEFT JOIN videos v ON v.id = COALESCE(ss.video_id, cs.video_id)
                LEFT JOIN stream_details sd ON v.id = sd.video_id
                GROUP BY s.id, s.title, s.artist
                HAVING COUNT(*) > 0
            )
            SELECT 
                song_id,
                title,
                artist,
                sing_count,
                latest_sing_date,
                performances
            FROM song_performances
            $whereClause
            $orderByClause
            LIMIT :limit OFFSET :offset
        """.trimIndent()

        var sqlQuery = template.databaseClient.sql(sql)
        bindings.forEach { (key, value) ->
            sqlQuery = sqlQuery.bind(key, value)
        }

        return sqlQuery.map { row ->
            val songId = SongId(row.get("song_id", UUID::class.java)!!)
            val title = row.get("title", String::class.java)!!
            val artist = row.get("artist", String::class.java)!!
            val singCount = (row.get("sing_count") as Number).toInt()
            val latestSingDate = row.get("latest_sing_date", Instant::class.java)
            
            // パフォーマンス情報のパース
            val performancesArray = row.get("performances", Array<String>::class.java) ?: arrayOf()
            val performances = performancesArray.mapNotNull { jsonString ->
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
                    logger.error("パフォーマンス情報のパース失敗: $jsonString", e)
                    null
                }
            }
            
            Song(
                id = songId,
                title = title,
                artist = artist,
                singCount = singCount,
                latestSingDate = latestSingDate,
                performances = performances
            )
        }.all().asFlow().toList()
    }

    override suspend fun countPerformedSongs(query: String?): Int {
        logger.info("楽曲検索結果総数取得: query=$query")

        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()

        query?.let {
            conditions.add("(title ILIKE :query OR artist ILIKE :query)")
            bindings["query"] = "%$it%"
        }

        val whereClause = if (conditions.isNotEmpty()) {
            "WHERE " + conditions.joinToString(" AND ")
        } else ""

        val sql = """
            SELECT COUNT(DISTINCT s.id)
            FROM songs s
            LEFT JOIN stream_songs ss ON s.id = ss.song_id
            LEFT JOIN concert_songs cs ON s.id = cs.song_id
            $whereClause
            AND (ss.song_id IS NOT NULL OR cs.song_id IS NOT NULL)
        """.trimIndent()

        var sqlQuery = template.databaseClient.sql(sql)
        bindings.forEach { (key, value) ->
            sqlQuery = sqlQuery.bind(key, value)
        }

        return sqlQuery.map { row -> (row.get(0) as Number).toInt() }
            .awaitSingle()
    }

    override suspend fun getPerformedSongsStats(
        topSongsLimit: Int,
        recentPerformancesLimit: Int
    ): SongStats {
        logger.info("楽曲統計情報取得")

        // 総楽曲数取得
        val totalSongsQuery = """
            SELECT COUNT(DISTINCT s.id)
            FROM songs s
            LEFT JOIN stream_songs ss ON s.id = ss.song_id
            LEFT JOIN concert_songs cs ON s.id = cs.song_id
            WHERE ss.song_id IS NOT NULL OR cs.song_id IS NOT NULL
        """.trimIndent()

        val totalSongs = template.databaseClient.sql(totalSongsQuery)
            .map { row -> (row.get(0) as Number).toInt() }
            .awaitSingle()

        // 総歌唱数取得
        val totalPerformancesQuery = """
            SELECT 
                (SELECT COUNT(*) FROM stream_songs) + 
                (SELECT COUNT(*) FROM concert_songs) as total
        """.trimIndent()

        val totalPerformances = template.databaseClient.sql(totalPerformancesQuery)
            .map { row -> (row.get(0) as Number).toInt() }
            .awaitSingle()

        // 上位楽曲取得
        val topSongsQuery = """
            SELECT 
                s.id,
                s.title,
                s.artist,
                COUNT(*) as sing_count
            FROM songs s
            LEFT JOIN stream_songs ss ON s.id = ss.song_id
            LEFT JOIN concert_songs cs ON s.id = cs.song_id
            WHERE ss.song_id IS NOT NULL OR cs.song_id IS NOT NULL
            GROUP BY s.id, s.title, s.artist
            ORDER BY sing_count DESC
            LIMIT :topSongsLimit
        """.trimIndent()

        val topSongs = template.databaseClient.sql(topSongsQuery)
            .bind("topSongsLimit", topSongsLimit)
            .map { row ->
                TopSongStats(
                    songId = SongId(row.get("id", UUID::class.java)!!),
                    title = row.get("title", String::class.java)!!,
                    artist = row.get("artist", String::class.java)!!,
                    singCount = (row.get("sing_count") as Number).toInt()
                )
            }.all().asFlow().toList()

        // 最新歌唱楽曲取得
        val recentPerformancesQuery = """
            SELECT 
                s.id,
                s.title,
                s.artist,
                MAX(COALESCE(ss.created_at, cs.created_at)) as latest_performance,
                FIRST_VALUE(COALESCE(ss.video_id, cs.video_id)) OVER (
                    PARTITION BY s.id 
                    ORDER BY COALESCE(ss.created_at, cs.created_at) DESC
                ) as latest_video_id,
                FIRST_VALUE(v.title) OVER (
                    PARTITION BY s.id 
                    ORDER BY COALESCE(ss.created_at, cs.created_at) DESC
                ) as latest_video_title,
                FIRST_VALUE(v.url) OVER (
                    PARTITION BY s.id 
                    ORDER BY COALESCE(ss.created_at, cs.created_at) DESC
                ) as latest_video_url
            FROM songs s
            LEFT JOIN stream_songs ss ON s.id = ss.song_id
            LEFT JOIN concert_songs cs ON s.id = cs.song_id
            LEFT JOIN videos v ON v.id = COALESCE(ss.video_id, cs.video_id)
            WHERE ss.song_id IS NOT NULL OR cs.song_id IS NOT NULL
            GROUP BY s.id, s.title, s.artist, ss.video_id, cs.video_id, ss.created_at, cs.created_at, v.title, v.url
            ORDER BY latest_performance DESC
            LIMIT :recentPerformancesLimit
        """.trimIndent()

        val recentPerformances = template.databaseClient.sql(recentPerformancesQuery)
            .bind("recentPerformancesLimit", recentPerformancesLimit)
            .map { row ->
                RecentPerformanceStats(
                    songId = SongId(row.get("id", UUID::class.java)!!),
                    title = row.get("title", String::class.java)!!,
                    artist = row.get("artist", String::class.java)!!,
                    latestPerformance = row.get("latest_performance", Instant::class.java)!!,
                    latestVideoId = VideoId(row.get("latest_video_id", String::class.java)!!),
                    latestVideoTitle = row.get("latest_video_title", String::class.java)!!,
                    latestVideoUrl = row.get("latest_video_url", String::class.java)!!
                )
            }.all().asFlow().toList()

        return SongStats(
            totalSongs = totalSongs,
            totalPerformances = totalPerformances,
            topSongs = topSongs,
            recentPerformances = recentPerformances
        )
    }
}
