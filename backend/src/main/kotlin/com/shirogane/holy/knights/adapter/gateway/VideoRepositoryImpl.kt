package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.VideoRepository
import kotlinx.coroutines.reactor.awaitSingle
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import io.r2dbc.spi.Row
import org.springframework.r2dbc.core.awaitSingle
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

    override suspend fun countVideosBySearchCriteria(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        logger.info("動画検索結果総数取得")

        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()

        // WHERE条件の構築
        query?.let {
            conditions.add("(v.title ILIKE :query OR v.description ILIKE :query)")
            bindings["query"] = "%$it%"
        }

        startDate?.let {
            conditions.add("vd.published_at >= :startDate")
            bindings["startDate"] = it
        }

        endDate?.let {
            conditions.add("vd.published_at <= :endDate")
            bindings["endDate"] = it
        }

        tags?.takeIf { it.isNotEmpty() }?.let {
            conditions.add("t.name = ANY(:tags)")
            bindings["tags"] = it.toTypedArray()
        }

        val whereClause = if (conditions.isNotEmpty()) {
            "WHERE vt.type = 'video' AND " + conditions.joinToString(" AND ")
        } else "WHERE vt.type = 'video'"

        val sql = """
                SELECT COUNT(DISTINCT v.id)
                FROM videos v
                JOIN video_video_types vvt ON v.id = vvt.video_id
                JOIN video_types vt ON vvt.video_type_id = vt.id
                LEFT JOIN video_details vd ON v.id = vd.video_id
                LEFT JOIN video_tags vtg ON v.id = vtg.video_id
                LEFT JOIN tags t ON vtg.tag_id = t.id
                $whereClause
            """.trimIndent()

        var sqlQuery = template.databaseClient.sql(sql)
        bindings.forEach { (key, value) ->
            sqlQuery = sqlQuery.bind(key, value)
        }

        return sqlQuery.map { row -> (row.get(0) as Number).toInt() }
            .awaitSingle()
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

        return sqlQuery.map { row -> (row.get(0) as Number).toInt() }
            .awaitSingle()
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
                conditions.add("(v.title ILIKE :query OR v.description ILIKE :query)")
                bindings["query"] = "%$it%"
            }

            startDate?.let {
                conditions.add("vd.published_at >= :startDate")
                bindings["startDate"] = it
            }

            endDate?.let {
                conditions.add("vd.published_at <= :endDate")
                bindings["endDate"] = it
            }

            tags?.takeIf { it.isNotEmpty() }?.let {
                conditions.add("t.name = ANY(:tags)")
                bindings["tags"] = it.toTypedArray()
            }

            val whereClause = if (conditions.isNotEmpty()) {
                "WHERE vt.type = 'video' AND " + conditions.joinToString(" AND ")
            } else "WHERE vt.type = 'video'"

            val sql = """
                SELECT 
                    v.id, v.title, v.description, v.url, v.thumbnail_url, 
                    v.duration, v.channel_id, v.created_at,
                    vd.published_at,
                    STRING_AGG(DISTINCT t.name, ',' ORDER BY t.name) as tags
                FROM videos v
                JOIN video_video_types vvt ON v.id = vvt.video_id
                JOIN video_types vt ON vvt.video_type_id = vt.id
                LEFT JOIN video_details vd ON v.id = vd.video_id
                LEFT JOIN video_tags vtg ON v.id = vtg.video_id
                LEFT JOIN tags t ON vtg.tag_id = t.id
                $whereClause
                GROUP BY v.id, v.title, v.description, v.url, v.thumbnail_url, 
                         v.duration, v.channel_id, v.created_at, vd.published_at
                ORDER BY vd.published_at DESC NULLS LAST, v.created_at DESC
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
            publishedAt = row.get("published_at", Instant::class.java) ?: row.get("created_at", Instant::class.java)!!,
            channelId = ChannelId(row.get("channel_id", String::class.java)!!),
            videoDetails = VideoDetailsVO(
                url = row.get("url", String::class.java) ?: "https://www.youtube.com/watch?v=${
                    row.get(
                        "id",
                        String::class.java
                    )
                }",
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
                url = row.get("url", String::class.java) ?: "https://www.youtube.com/watch?v=${
                    row.get(
                        "id",
                        String::class.java
                    )
                }",
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
    val description: String?,
    val url: String?,
    val thumbnailUrl: String?,
    val duration: String?,
    val channelId: String,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("video_details")
data class VideoDetailsEntity(
    @org.springframework.data.annotation.Id
    val videoId: String,
    val publishedAt: Instant?,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("stream_details")
data class StreamDetailsEntity(
    @org.springframework.data.annotation.Id
    val videoId: String,
    val startedAt: Instant?,
    val createdAt: Instant?
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
    val name: String,
    val description: String?,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("video_types")
data class VideoTypeEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val type: String
)

@org.springframework.data.relational.core.mapping.Table("video_video_types")
data class VideoVideoTypeEntity(
    val videoId: String,
    val videoTypeId: Int,
    val createdAt: Instant?
)
