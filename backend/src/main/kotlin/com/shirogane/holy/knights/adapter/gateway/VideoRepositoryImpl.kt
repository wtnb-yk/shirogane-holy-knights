package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.VideoRepository
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.adapter.gateway.query.VideoQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.query.StreamQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.mapper.VideoRowMapper
import com.shirogane.holy.knights.adapter.gateway.mapper.StreamRowMapper
import com.shirogane.holy.knights.adapter.gateway.model.VideoSearchCriteria
import com.shirogane.holy.knights.adapter.gateway.model.StreamSearchCriteria
import kotlinx.coroutines.reactor.awaitSingle
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class VideoRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val videoQueryBuilder: VideoQueryBuilder,
    private val streamQueryBuilder: StreamQueryBuilder,
    private val videoRowMapper: VideoRowMapper,
    private val streamRowMapper: StreamRowMapper,
    private val template: R2dbcEntityTemplate
) : VideoRepository {

    private val logger = LoggerFactory.getLogger(VideoRepositoryImpl::class.java)

    override suspend fun searchVideos(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): Videos {
        val criteria = VideoSearchCriteria(
            query = query,
            tags = tags,
            startDate = startDate,
            endDate = endDate,
            limit = limit,
            offset = offset
        )

        val querySpec = videoQueryBuilder.buildSearchQuery(criteria)
        val videos = queryExecutor.execute(querySpec, videoRowMapper)

        return Videos(videos)
    }

    override suspend fun countVideos(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        val criteria = VideoSearchCriteria(
            query = query,
            tags = tags,
            startDate = startDate,
            endDate = endDate,
            limit = 0,
            offset = 0
        )
        
        val querySpec = videoQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun getAllVideoTags(): List<String> {
        val sql = """
                SELECT name
                FROM video_tags
                ORDER BY name
            """.trimIndent()

        return template.databaseClient.sql(sql)
            .map { row -> row.get("name", String::class.java)!! }
            .all()
            .collectList()
            .awaitSingle()
    }

    override suspend fun searchStreams(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): Videos {
        val criteria = StreamSearchCriteria(
            query = query,
            tags = tags,
            startDate = startDate,
            endDate = endDate,
            limit = limit,
            offset = offset
        )
        
        val querySpec = streamQueryBuilder.buildSearchQuery(criteria)
        val streams = queryExecutor.execute(querySpec, streamRowMapper)

        return Videos(streams)
    }

    override suspend fun countStreams(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        val criteria = StreamSearchCriteria(
            query = query,
            tags = tags,
            startDate = startDate,
            endDate = endDate,
            limit = 0,
            offset = 0
        )
        
        val querySpec = streamQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun getAllStreamTags(): List<String> {
        val sql = """
                SELECT name
                FROM stream_tags
                ORDER BY name
            """.trimIndent()

        return template.databaseClient.sql(sql)
            .map { row -> row.get("name", String::class.java)!! }
            .all()
            .collectList()
            .awaitSingle()
    }
}
