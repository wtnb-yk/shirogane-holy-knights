package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.SongRepository
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.adapter.gateway.query.SongQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.mapper.SongRowMapper
import com.shirogane.holy.knights.adapter.gateway.model.SongSearchCriteria
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Repository
import org.springframework.r2dbc.core.awaitSingle
import java.time.Instant
import java.util.*

@Repository
class SongRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val songQueryBuilder: SongQueryBuilder,
    private val songRowMapper: SongRowMapper,
    private val template: R2dbcEntityTemplate
) : SongRepository {

    override suspend fun searchStreamSongs(
        query: String?,
        sortBy: String,
        sortOrder: String,
        startDate: Instant?,
        endDate: Instant?,
        frequencyCategories: List<SingFrequencyCategory>?,
        limit: Int,
        offset: Int
    ): Songs {
        val criteria = SongSearchCriteria(
            query = query,
            sortBy = sortBy,
            sortOrder = sortOrder,
            startDate = startDate,
            endDate = endDate,
            frequencyCategories = frequencyCategories,
            limit = limit,
            offset = offset
        )
        
        val querySpec = songQueryBuilder.buildSearchQuery(criteria)
        val songs = queryExecutor.execute(querySpec, songRowMapper)
        
        return Songs(songs)
    }

    override suspend fun countStreamSongs(
        query: String?,
        startDate: Instant?,
        endDate: Instant?,
        frequencyCategories: List<SingFrequencyCategory>?
    ): Int {
        val criteria = SongSearchCriteria(
            query = query,
            sortBy = "singCount",
            sortOrder = "DESC",
            startDate = startDate,
            endDate = endDate,
            frequencyCategories = frequencyCategories,
            limit = 0,
            offset = 0
        )
        
        val querySpec = songQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun getStreamSongsStats(
        topSongsLimit: Int,
        recentPerformancesLimit: Int
    ): SongStats {
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

        val totalPerformancesQuery = """
            SELECT 
                (SELECT COUNT(*) FROM stream_songs) + 
                (SELECT COUNT(*) FROM concert_songs) as total
        """.trimIndent()

        val totalPerformances = template.databaseClient.sql(totalPerformancesQuery)
            .map { row -> (row.get(0) as Number).toInt() }
            .awaitSingle()

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
                    latestContentId = ContentId(row.get("latest_video_id", String::class.java)!!),
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

    override suspend fun searchConcertSongs(
        query: String?,
        sortBy: String,
        sortOrder: String,
        startDate: Instant?,
        endDate: Instant?,
        frequencyCategories: List<SingFrequencyCategory>?,
        limit: Int,
        offset: Int
    ): Songs {
        val criteria = SongSearchCriteria(
            query = query,
            sortBy = sortBy,
            sortOrder = sortOrder,
            startDate = startDate,
            endDate = endDate,
            frequencyCategories = frequencyCategories,
            limit = limit,
            offset = offset
        )
        
        val querySpec = songQueryBuilder.buildConcertSearchQuery(criteria)
        val songs = queryExecutor.execute(querySpec, songRowMapper)
        
        return Songs(songs)
    }

    override suspend fun countConcertSongs(
        query: String?,
        startDate: Instant?,
        endDate: Instant?,
        frequencyCategories: List<SingFrequencyCategory>?
    ): Int {
        val criteria = SongSearchCriteria(
            query = query,
            sortBy = "singCount",
            sortOrder = "DESC",
            startDate = startDate,
            endDate = endDate,
            frequencyCategories = frequencyCategories,
            limit = 0,
            offset = 0
        )
        
        val querySpec = songQueryBuilder.buildConcertCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun getConcertSongsStats(
        topSongsLimit: Int,
        recentPerformancesLimit: Int
    ): SongStats =
        getStreamSongsStats(topSongsLimit, recentPerformancesLimit)


}
