package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.model.VideoSearchCriteria
import com.shirogane.holy.knights.adapter.gateway.model.StreamSearchCriteria
import com.shirogane.holy.knights.domain.model.Channel
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class VideoQueryBuilder : QueryBuilder<VideoSearchCriteria> {
    
    override fun buildSearchQuery(criteria: VideoSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.tags,
            criteria.startDate,
            criteria.endDate,
            dateColumn = "v.published_at"
        )
        
        val whereClause = buildWhereClause("video", conditions.first)
        
        // Optimized query using composite indexes and avoiding unnecessary JOINs when no tag filtering
        val sql = if (criteria.tags.isNullOrEmpty()) {
            """
            SELECT 
                v.id, v.title, v.description, v.url, v.thumbnail_url, 
                v.duration, v.channel_id, v.published_at,
                COALESCE(tag_data.tags, '') as tags
            FROM videos v
            JOIN video_video_types vvt ON v.id = vvt.video_id
            JOIN video_types vt ON vvt.video_type_id = vt.id
            LEFT JOIN (
                SELECT vtg.video_id, STRING_AGG(t.name, ',' ORDER BY t.name) as tags
                FROM video_video_tags vtg
                JOIN video_tags t ON vtg.tag_id = t.id
                GROUP BY vtg.video_id
            ) tag_data ON v.id = tag_data.video_id
            $whereClause
            ORDER BY v.published_at DESC NULLS LAST, v.created_at DESC
            LIMIT :limit OFFSET :offset
            """.trimIndent()
        } else {
            """
            SELECT 
                v.id, v.title, v.description, v.url, v.thumbnail_url, 
                v.duration, v.channel_id, v.published_at,
                STRING_AGG(DISTINCT t.name, ',' ORDER BY t.name) as tags
            FROM videos v
            JOIN video_video_types vvt ON v.id = vvt.video_id
            JOIN video_types vt ON vvt.video_type_id = vt.id
            JOIN video_video_tags vtg ON v.id = vtg.video_id
            JOIN video_tags t ON vtg.tag_id = t.id
            $whereClause
            GROUP BY v.id, v.title, v.description, v.url, v.thumbnail_url, 
                     v.duration, v.channel_id, v.created_at, v.published_at
            ORDER BY v.published_at DESC NULLS LAST, v.created_at DESC
            LIMIT :limit OFFSET :offset
            """.trimIndent()
        }
        
        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset,
            "channelId" to Channel.SHIROGANE_NOEL_ID
        )
        
        return QuerySpec(sql, bindings)
    }
    
    override fun buildCountQuery(criteria: VideoSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.tags,
            criteria.startDate,
            criteria.endDate,
            dateColumn = "v.published_at"
        )
        
        val whereClause = buildWhereClause("video", conditions.first)
        
        val sql = """
            SELECT COUNT(DISTINCT v.id)
            FROM videos v
            JOIN video_video_types vvt ON v.id = vvt.video_id
            JOIN video_types vt ON vvt.video_type_id = vt.id
            LEFT JOIN video_video_tags vtg ON v.id = vtg.video_id
            LEFT JOIN video_tags t ON vtg.tag_id = t.id
            $whereClause
        """.trimIndent()
        
        val bindings = conditions.second + mapOf(
            "channelId" to Channel.SHIROGANE_NOEL_ID
        )
        
        return QuerySpec(sql, bindings)
    }
    
    private fun buildSearchConditions(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        dateColumn: String
    ): Pair<List<String>, Map<String, Any>> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
        query?.let {
            conditions.add("(v.title ILIKE :query OR v.description ILIKE :query)")
            bindings["query"] = "%$it%"
        }
        
        startDate?.let {
            conditions.add("$dateColumn >= :startDate")
            bindings["startDate"] = it
        }
        
        endDate?.let {
            conditions.add("$dateColumn <= :endDate")
            bindings["endDate"] = it
        }
        
        tags?.takeIf { it.isNotEmpty() }?.let {
            // Optimized tag filtering using EXISTS instead of IN subquery
            conditions.add("""
                EXISTS (
                    SELECT 1
                    FROM video_video_tags vtg
                    JOIN video_tags t ON vtg.tag_id = t.id
                    WHERE vtg.video_id = v.id 
                    AND t.name = ANY(:tags)
                    GROUP BY vtg.video_id
                    HAVING COUNT(DISTINCT t.name) = :tagCount
                )
            """.trimIndent())
            bindings["tags"] = it.toTypedArray()
            bindings["tagCount"] = it.size
        }
        
        return Pair(conditions, bindings)
    }
    
    private fun buildWhereClause(type: String, conditions: List<String>): String {
        val allConditions = listOf("vt.type = '$type'", "v.channel_id = :channelId") + conditions
        return "WHERE " + allConditions.joinToString(" AND ")
    }
}

@Component
class StreamQueryBuilder : QueryBuilder<StreamSearchCriteria> {
    
    override fun buildSearchQuery(criteria: StreamSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.tags,
            criteria.startDate,
            criteria.endDate
        )
        
        val whereClause = buildWhereClause("stream", conditions.first)
        
        val sql = """
            SELECT 
                v.id, v.title, v.description, v.url, v.thumbnail_url, 
                v.duration, v.channel_id, v.published_at, sd.started_at,
                STRING_AGG(DISTINCT t.name, ',' ORDER BY t.name) as stream_tags
            FROM videos v
            JOIN video_video_types vvt ON v.id = vvt.video_id
            JOIN video_types vt ON vvt.video_type_id = vt.id
            LEFT JOIN stream_details sd ON v.id = sd.video_id
            LEFT JOIN video_stream_tags vst ON v.id = vst.video_id
            LEFT JOIN stream_tags t ON vst.tag_id = t.id
            $whereClause
            GROUP BY v.id, v.title, v.description, v.url, v.thumbnail_url, 
                     v.duration, v.channel_id, v.published_at, sd.started_at
            ORDER BY sd.started_at DESC NULLS LAST, v.published_at DESC
            LIMIT :limit OFFSET :offset
        """.trimIndent()
        
        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset,
            "channelId" to Channel.SHIROGANE_NOEL_ID
        )
        
        return QuerySpec(sql, bindings)
    }
    
    override fun buildCountQuery(criteria: StreamSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.tags,
            criteria.startDate,
            criteria.endDate
        )
        
        val whereClause = buildWhereClause("stream", conditions.first)
        
        val sql = """
            SELECT COUNT(DISTINCT v.id)
            FROM videos v
            JOIN video_video_types vvt ON v.id = vvt.video_id
            JOIN video_types vt ON vvt.video_type_id = vt.id
            LEFT JOIN stream_details sd ON v.id = sd.video_id
            LEFT JOIN video_stream_tags vst ON v.id = vst.video_id
            LEFT JOIN stream_tags t ON vst.tag_id = t.id
            $whereClause
        """.trimIndent()
        
        val bindings = conditions.second + mapOf(
            "channelId" to Channel.SHIROGANE_NOEL_ID
        )
        
        return QuerySpec(sql, bindings)
    }
    
    private fun buildSearchConditions(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Pair<List<String>, Map<String, Any>> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
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
            // Optimized tag filtering using EXISTS instead of IN subquery
            conditions.add("""
                EXISTS (
                    SELECT 1
                    FROM video_stream_tags vst
                    JOIN stream_tags t ON vst.tag_id = t.id
                    WHERE vst.video_id = v.id 
                    AND t.name = ANY(:tags)
                    GROUP BY vst.video_id
                    HAVING COUNT(DISTINCT t.name) = :tagCount
                )
            """.trimIndent())
            bindings["tags"] = it.toTypedArray()
            bindings["tagCount"] = it.size
        }
        
        return Pair(conditions, bindings)
    }
    
    private fun buildWhereClause(type: String, conditions: List<String>): String {
        // Optimized hidden streams filtering using NOT EXISTS for better performance
        val hiddenCondition = "NOT EXISTS (SELECT 1 FROM hidden_streams hs WHERE hs.video_id = v.id)"
        val allConditions = listOf("vt.type = '$type'", "v.channel_id = :channelId", hiddenCondition) + conditions
        return "WHERE " + allConditions.joinToString(" AND ")
    }
}