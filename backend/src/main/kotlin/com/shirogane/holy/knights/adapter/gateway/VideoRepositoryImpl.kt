package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.VideoRepository
import kotlinx.coroutines.reactor.awaitSingle
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import io.r2dbc.spi.Row
import java.time.Instant

class VideoRepositoryImpl(
    private val template: R2dbcEntityTemplate
) : VideoRepository {

    private val logger = LoggerFactory.getLogger(VideoRepositoryImpl::class.java)

    override suspend fun search(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Video> {
        return searchWithJoin(query, tags, startDate, endDate, limit, offset)
    }

    override suspend fun countBySearchCriteria(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        logger.info("検索結果総数取得")
        return try {
            var criteria = Criteria.empty()
            
            query?.let {
                criteria = criteria.and(
                    Criteria.where("title").like("%$it%")
                        .or(Criteria.where("description").like("%$it%"))
                )
            }
            
            startDate?.let {
                criteria = criteria.and(Criteria.where("published_at").greaterThanOrEquals(it))
            }
            endDate?.let {
                criteria = criteria.and(Criteria.where("published_at").lessThanOrEquals(it))
            }
            
            tags?.takeIf { it.isNotEmpty() }?.let {
                val tagCriteria = it.map { tag ->
                    Criteria.where("tags").like("%$tag%")
                }.reduce { acc, criterion -> acc.or(criterion) }
                criteria = criteria.and(tagCriteria)
            }
            
            val countQuery = if (criteria == Criteria.empty()) {
                Query.empty()
            } else {
                Query.query(criteria)
            }
            
            template.count(countQuery, VideoEntity::class.java)
                .awaitSingle()
                .toInt()
        } catch (e: Exception) {
            logger.error("検索結果総数取得エラー", e)
            0
        }
    }

    override suspend fun searchStreams(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Video> {
        return searchStreamsWithJoin(query, tags, startDate, endDate, limit, offset)
    }

    override suspend fun countStreamsBySearchCriteria(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        logger.info("配信検索結果総数取得")
        return try {
            val conditions = mutableListOf<String>()
            val bindings = mutableMapOf<String, Any>()

            // WHERE条件の構築
            query?.let {
                conditions.add("(v.title ILIKE :query OR v.description ILIKE :query)")
                bindings["query"] = "%$it%"
            }

            startDate?.let {
                conditions.add("sd.started_at >= :startDate")
                bindings["startDate"] = it
            }

            endDate?.let {
                conditions.add("sd.started_at <= :endDate")
                bindings["endDate"] = it
            }

            tags?.takeIf { it.isNotEmpty() }?.let {
                conditions.add("t.name = ANY(:tags)")
                bindings["tags"] = it.toTypedArray()
            }

            val whereClause = if (conditions.isNotEmpty()) {
                "WHERE vt.type = 'stream' AND " + conditions.joinToString(" AND ")
            } else "WHERE vt.type = 'stream'"

            val sql = """
                SELECT COUNT(DISTINCT v.id)
                FROM videos v
                JOIN video_video_types vvt ON v.id = vvt.video_id
                JOIN video_types vt ON vvt.video_type_id = vt.id
                LEFT JOIN stream_details sd ON v.id = sd.video_id
                LEFT JOIN video_tags vtg ON v.id = vtg.video_id
                LEFT JOIN tags t ON vtg.tag_id = t.id
                $whereClause
            """.trimIndent()

            var sqlQuery = template.databaseClient.sql(sql)
            bindings.forEach { (key, value) ->
                sqlQuery = sqlQuery.bind(key, value)
            }

            sqlQuery.map { row -> (row.get(0) as Number).toInt() }
                .awaitSingle()
        } catch (e: Exception) {
            logger.error("配信検索結果総数取得エラー", e)
            0
        }
    }

    private suspend fun searchWithJoin(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Video> {
        logger.info("JOINクエリで動画検索: query=$query, tags=$tags")
        return try {
            val conditions = mutableListOf<String>()
            val bindings = mutableMapOf<String, Any>()

            // WHERE条件の構築
            query?.let {
                conditions.add("(v.title ILIKE :query OR cd.description ILIKE :query)")
                bindings["query"] = "%$it%"
            }

            startDate?.let {
                conditions.add("v.published_at >= :startDate")
                bindings["startDate"] = it
            }

            endDate?.let {
                conditions.add("v.published_at <= :endDate")
                bindings["endDate"] = it
            }

            tags?.takeIf { it.isNotEmpty() }?.let {
                conditions.add("t.name = ANY(:tags)")
                bindings["tags"] = it.toTypedArray()
            }

            val whereClause = if (conditions.isNotEmpty()) {
                "WHERE " + conditions.joinToString(" AND ")
            } else ""

            val sql = """
                SELECT 
                    v.id, v.title, v.published_at, v.channel_id,
                    vd.url, vd.duration, vd.thumbnail_url,
                    cd.description,
                    STRING_AGG(DISTINCT t.name, ',' ORDER BY t.name) as tags
                FROM videos v
                LEFT JOIN video_details vd ON v.id = vd.video_id
                LEFT JOIN content_details cd ON v.id = cd.video_id
                LEFT JOIN video_tags vt ON v.id = vt.video_id
                LEFT JOIN tags t ON vt.tag_id = t.id
                $whereClause
                GROUP BY v.id, v.title, v.published_at, v.channel_id,
                         vd.url, vd.duration, vd.thumbnail_url,
                         cd.description
                ORDER BY v.published_at DESC
                LIMIT :limit OFFSET :offset
            """.trimIndent()

            var sqlQuery = template.databaseClient.sql(sql)
            bindings.forEach { (key, value) ->
                sqlQuery = sqlQuery.bind(key, value)
            }
            sqlQuery = sqlQuery.bind("limit", limit).bind("offset", offset)

            sqlQuery.map { row -> buildVideoFromRow(row as Row) }
                .all()
                .collectList()
                .awaitSingle()
        } catch (e: Exception) {
            logger.error("JOINクエリでの動画検索エラー", e)
            emptyList()
        }
    }

    private suspend fun searchStreamsWithJoin(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Video> {
        logger.info("JOINクエリで配信検索: query=$query, tags=$tags")
        return try {
            val conditions = mutableListOf<String>()
            val bindings = mutableMapOf<String, Any>()

            // WHERE条件の構築
            query?.let {
                conditions.add("(v.title ILIKE :query OR v.description ILIKE :query)")
                bindings["query"] = "%$it%"
            }

            startDate?.let {
                conditions.add("sd.started_at >= :startDate")
                bindings["startDate"] = it
            }

            endDate?.let {
                conditions.add("sd.started_at <= :endDate")
                bindings["endDate"] = it
            }

            tags?.takeIf { it.isNotEmpty() }?.let {
                conditions.add("t.name = ANY(:tags)")
                bindings["tags"] = it.toTypedArray()
            }

            val whereClause = if (conditions.isNotEmpty()) {
                "WHERE vt.type = 'stream' AND " + conditions.joinToString(" AND ")
            } else "WHERE vt.type = 'stream'"

            val sql = """
                SELECT 
                    v.id, v.title, v.description, v.url, v.thumbnail_url, 
                    v.duration, v.channel_id, v.created_at,
                    sd.started_at,
                    STRING_AGG(DISTINCT t.name, ',' ORDER BY t.name) as tags
                FROM videos v
                JOIN video_video_types vvt ON v.id = vvt.video_id
                JOIN video_types vt ON vvt.video_type_id = vt.id
                LEFT JOIN stream_details sd ON v.id = sd.video_id
                LEFT JOIN video_tags vtg ON v.id = vtg.video_id
                LEFT JOIN tags t ON vtg.tag_id = t.id
                $whereClause
                GROUP BY v.id, v.title, v.description, v.url, v.thumbnail_url, 
                         v.duration, v.channel_id, v.created_at, sd.started_at
                ORDER BY sd.started_at DESC NULLS LAST, v.created_at DESC
                LIMIT :limit OFFSET :offset
            """.trimIndent()

            var sqlQuery = template.databaseClient.sql(sql)
            bindings.forEach { (key, value) ->
                sqlQuery = sqlQuery.bind(key, value)
            }
            sqlQuery = sqlQuery.bind("limit", limit).bind("offset", offset)

            sqlQuery.map { row -> buildStreamFromRow(row as Row) }
                .all()
                .collectList()
                .awaitSingle()
        } catch (e: Exception) {
            logger.error("JOINクエリでの配信検索エラー", e)
            emptyList()
        }
    }

    private fun buildVideoFromRow(row: Row): Video {
        val tags = row.get("tags", String::class.java)
            ?.split(",")
            ?.filter { it.isNotBlank() }
            ?.map { Tag(it.trim()) }
            ?: emptyList()

        return Video(
            id = VideoId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            publishedAt = row.get("published_at", Instant::class.java)!!,
            channelId = ChannelId(row.get("channel_id", String::class.java)!!),
            videoDetails = VideoDetailsVO(
                url = row.get("url", String::class.java) ?: "",
                duration = row.get("duration", String::class.java)?.let { Duration(it) },
                thumbnailUrl = row.get("thumbnail_url", String::class.java)
            ),
            contentDetails = ContentDetails(
                description = row.get("description", String::class.java),
            ),
            tags = tags
        )
    }

    private fun buildStreamFromRow(row: Row): Video {
        val tags = row.get("tags", String::class.java)
            ?.split(",")
            ?.filter { it.isNotBlank() }
            ?.map { Tag(it.trim()) }
            ?: emptyList()

        return Video(
            id = VideoId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            publishedAt = row.get("created_at", Instant::class.java)!!,
            channelId = ChannelId(row.get("channel_id", String::class.java)!!),
            videoDetails = VideoDetailsVO(
                url = row.get("url", String::class.java) ?: "https://www.youtube.com/watch?v=${row.get("id", String::class.java)}",
                duration = row.get("duration", String::class.java)?.let { Duration(it) },
                thumbnailUrl = row.get("thumbnail_url", String::class.java)
            ),
            streamDetails = StreamDetailsVO(
                startedAt = row.get("started_at", Instant::class.java)
            ),
            contentDetails = ContentDetails(
                description = row.get("description", String::class.java),
            ),
            tags = tags
        )
    }
}

/**
 * データベーステーブルマッピング用エンティティ
 */
@org.springframework.data.relational.core.mapping.Table("videos")
data class VideoEntity(
    @org.springframework.data.annotation.Id
    val id: String,
    val title: String,
    val publishedAt: Instant,
    val channelId: String
)

@org.springframework.data.relational.core.mapping.Table("video_details")
data class VideoDetailsEntity(
    @org.springframework.data.annotation.Id
    val videoId: String,
    val url: String,
    val duration: String?,
    val thumbnailUrl: String?
)

@org.springframework.data.relational.core.mapping.Table("content_details")
data class ContentDetailsEntity(
    @org.springframework.data.annotation.Id
    val videoId: String,
    val description: String?
)

@org.springframework.data.relational.core.mapping.Table("video_tags")
data class VideoTagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val videoId: String,
    val tagId: Long
)

@org.springframework.data.relational.core.mapping.Table("tags")
data class TagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val name: String
)
