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
        // Optimized single query for total counts using UNION ALL
        val totalCountsQuery = """
            SELECT 
                COUNT(DISTINCT song_id) as total_songs,
                COUNT(*) as total_performances
            FROM (
                SELECT song_id FROM stream_songs
                UNION ALL
                SELECT song_id FROM concert_songs
            ) all_performances
        """.trimIndent()

        val totalCounts = template.databaseClient.sql(totalCountsQuery)
            .map { row ->
                Pair(
                    (row.get("total_songs") as Number).toInt(),
                    (row.get("total_performances") as Number).toInt()
                )
            }.awaitSingle()

        // Optimized top songs query using composite index
        val topSongsQuery = """
            SELECT 
                s.id,
                s.title,
                s.artist,
                (stream_count + concert_count) as sing_count
            FROM songs s
            JOIN (
                SELECT 
                    song_id,
                    COUNT(*) as stream_count,
                    0 as concert_count
                FROM stream_songs
                GROUP BY song_id
                UNION ALL
                SELECT 
                    song_id,
                    0 as stream_count,
                    COUNT(*) as concert_count
                FROM concert_songs
                GROUP BY song_id
            ) counts ON s.id = counts.song_id
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

        // Optimized recent performances query using LATERAL JOIN
        val recentPerformancesQuery = """
            SELECT DISTINCT ON (s.id)
                s.id,
                s.title,
                s.artist,
                latest.latest_performance,
                latest.latest_video_id,
                latest.latest_video_title,
                latest.latest_video_url
            FROM songs s
            JOIN LATERAL (
                SELECT 
                    ss.created_at as latest_performance,
                    ss.video_id as latest_video_id,
                    v.title as latest_video_title,
                    v.url as latest_video_url
                FROM stream_songs ss
                JOIN videos v ON v.id = ss.video_id
                WHERE ss.song_id = s.id
                UNION ALL
                SELECT 
                    cs.created_at as latest_performance,
                    cs.video_id as latest_video_id,
                    v.title as latest_video_title,
                    v.url as latest_video_url
                FROM concert_songs cs
                JOIN videos v ON v.id = cs.video_id
                WHERE cs.song_id = s.id
                ORDER BY latest_performance DESC
                LIMIT 1
            ) latest ON true
            ORDER BY s.id, latest.latest_performance DESC
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
            totalSongs = totalCounts.first,
            totalPerformances = totalCounts.second,
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
