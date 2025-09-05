package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.model.SongSearchCriteria
import com.shirogane.holy.knights.domain.model.SingFrequencyCategory
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class SongQueryBuilder : QueryBuilder<SongSearchCriteria> {
    
    override fun buildSearchQuery(criteria: SongSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.startDate,
            criteria.endDate
        )
        
        val outerWhereClause = buildOuterWhereClause(criteria.query, criteria.frequencyCategories)
        val innerWhereClause = buildInnerWhereClause(conditions.first)
        
        val orderByClause = buildOrderByClause(criteria.sortBy, criteria.sortOrder)
        
        val sql = """
            WITH song_performances AS (
                SELECT 
                    s.id as song_id,
                    s.title,
                    s.artist,
                    COUNT(*) as sing_count,
                    MAX(sd.started_at) as latest_sing_date,
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'video_id', ss.video_id,
                            'video_title', v.title,
                            'performance_type', 'STREAM',
                            'url', v.url,
                            'start_seconds', ss.start_seconds,
                            'performed_at', sd.started_at,
                            'stream_song_url', 
                            CASE 
                                WHEN ss.start_seconds > 0 
                                THEN v.url || '&t=' || ss.start_seconds || 's'
                                ELSE v.url 
                            END
                        ) ORDER BY sd.started_at DESC
                    ) as performances
                FROM songs s
                INNER JOIN stream_songs ss ON s.id = ss.song_id
                INNER JOIN videos v ON v.id = ss.video_id
                INNER JOIN stream_details sd ON v.id = sd.video_id
                $innerWhereClause
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
            $outerWhereClause
            $orderByClause
            LIMIT :limit OFFSET :offset
        """.trimIndent()
        
        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset
        )
        
        return QuerySpec(sql, bindings)
    }
    
    override fun buildCountQuery(criteria: SongSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.startDate,
            criteria.endDate
        )
        
        val outerWhereClause = buildOuterWhereClause(criteria.query, criteria.frequencyCategories)
        val innerWhereClause = buildInnerWhereClause(conditions.first)
        
        val sql = """
            SELECT COUNT(*)
            FROM (
                WITH song_performances AS (
                    SELECT 
                        s.id as song_id,
                        s.title,
                        s.artist,
                        COUNT(*) as sing_count
                    FROM songs s
                    INNER JOIN stream_songs ss ON s.id = ss.song_id
                    INNER JOIN videos v ON v.id = ss.video_id
                    INNER JOIN stream_details sd ON v.id = sd.video_id
                    $innerWhereClause
                    GROUP BY s.id, s.title, s.artist
                    HAVING COUNT(*) > 0
                )
                SELECT song_id, title, artist, sing_count
                FROM song_performances
                $outerWhereClause
            ) counted_songs
        """.trimIndent()
        
        return QuerySpec(sql, conditions.second)
    }
    
    fun buildConcertSearchQuery(criteria: SongSearchCriteria): QuerySpec {
        val conditions = buildConcertSearchConditions(
            criteria.query,
            criteria.startDate,
            criteria.endDate
        )
        
        val outerWhereClause = buildOuterWhereClause(criteria.query, criteria.frequencyCategories)
        val innerWhereClause = buildInnerWhereClause(conditions.first)
        
        val orderByClause = buildOrderByClause(criteria.sortBy, criteria.sortOrder)
        
        val sql = """
            WITH song_performances AS (
                SELECT 
                    s.id as song_id,
                    s.title,
                    s.artist,
                    COUNT(*) as sing_count,
                    MAX(v.published_at) as latest_sing_date,
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'video_id', cs.video_id,
                            'video_title', v.title,
                            'performance_type', 'CONCERT',
                            'url', v.url,
                            'start_seconds', cs.start_seconds,
                            'performed_at', v.published_at,
                            'stream_song_url', 
                            CASE 
                                WHEN cs.start_seconds > 0 
                                THEN v.url || '&t=' || cs.start_seconds || 's'
                                ELSE v.url 
                            END
                        ) ORDER BY v.published_at DESC
                    ) as performances
                FROM songs s
                INNER JOIN concert_songs cs ON s.id = cs.song_id
                INNER JOIN videos v ON v.id = cs.video_id
                $innerWhereClause
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
            $outerWhereClause
            $orderByClause
            LIMIT :limit OFFSET :offset
        """.trimIndent()
        
        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset
        )
        
        return QuerySpec(sql, bindings)
    }
    
    fun buildConcertCountQuery(criteria: SongSearchCriteria): QuerySpec {
        val conditions = buildConcertSearchConditions(
            criteria.query,
            criteria.startDate,
            criteria.endDate
        )
        
        val outerWhereClause = buildOuterWhereClause(criteria.query, criteria.frequencyCategories)
        val innerWhereClause = buildInnerWhereClause(conditions.first)
        
        val sql = """
            SELECT COUNT(*)
            FROM (
                WITH song_performances AS (
                    SELECT 
                        s.id as song_id,
                        s.title,
                        s.artist,
                        COUNT(*) as sing_count
                    FROM songs s
                    INNER JOIN concert_songs cs ON s.id = cs.song_id
                    INNER JOIN videos v ON v.id = cs.video_id
                    $innerWhereClause
                    GROUP BY s.id, s.title, s.artist
                    HAVING COUNT(*) > 0
                )
                SELECT song_id, title, artist, sing_count
                FROM song_performances
                $outerWhereClause
            ) counted_songs
        """.trimIndent()
        
        return QuerySpec(sql, conditions.second)
    }
    
    private fun buildSearchConditions(
        query: String?,
        startDate: Instant?,
        endDate: Instant?
    ): Pair<List<String>, Map<String, Any>> {
        val innerConditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
        query?.let {
            bindings["query"] = "%$it%"
        }
        
        startDate?.let {
            innerConditions.add("sd.started_at >= :startDate")
            bindings["startDate"] = it
        }
        
        endDate?.let {
            innerConditions.add("sd.started_at <= :endDate")
            bindings["endDate"] = it
        }
        
        return Pair(innerConditions, bindings)
    }
    
    private fun buildConcertSearchConditions(
        query: String?,
        startDate: Instant?,
        endDate: Instant?
    ): Pair<List<String>, Map<String, Any>> {
        val innerConditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()
        
        query?.let {
            bindings["query"] = "%$it%"
        }
        
        startDate?.let {
            innerConditions.add("v.published_at >= :startDate")
            bindings["startDate"] = it
        }
        
        endDate?.let {
            innerConditions.add("v.published_at <= :endDate")
            bindings["endDate"] = it
        }
        
        return Pair(innerConditions, bindings)
    }
    
    private fun buildOuterWhereClause(query: String?, frequencyCategories: List<SingFrequencyCategory>?): String {
        val conditions = mutableListOf<String>()
        
        query?.let {
            conditions.add("(title ILIKE :query OR artist ILIKE :query)")
        }
        
        val frequencyCondition = buildFrequencyCondition(frequencyCategories)
        if (frequencyCondition.isNotEmpty()) {
            conditions.add("($frequencyCondition)")
        }
        
        return if (conditions.isNotEmpty()) {
            "WHERE " + conditions.joinToString(" AND ")
        } else ""
    }
    
    private fun buildInnerWhereClause(conditions: List<String>): String {
        return if (conditions.isNotEmpty()) {
            "WHERE " + conditions.joinToString(" AND ")
        } else ""
    }
    
    private fun buildOrderByClause(sortBy: String, sortOrder: String): String {
        return when (sortBy) {
            "singCount" -> "ORDER BY sing_count $sortOrder"
            "latestSingDate" -> "ORDER BY latest_sing_date $sortOrder"
            "title" -> "ORDER BY s.title $sortOrder"
            else -> "ORDER BY sing_count $sortOrder"
        }
    }
    
    private fun buildFrequencyCondition(frequencyCategories: List<SingFrequencyCategory>?, useAlias: Boolean = true): String {
        if (frequencyCategories.isNullOrEmpty()) return ""
        
        val conditions = mutableListOf<String>()
        val countColumn = if (useAlias) "sing_count" else "COUNT(*)"
        
        frequencyCategories.forEach { category ->
            when (category) {
                SingFrequencyCategory.LOW -> conditions.add("$countColumn BETWEEN 1 AND 2")
                SingFrequencyCategory.MEDIUM -> conditions.add("$countColumn BETWEEN 3 AND 5") 
                SingFrequencyCategory.HIGH -> conditions.add("$countColumn BETWEEN 6 AND 10")
                SingFrequencyCategory.VERY_HIGH -> conditions.add("$countColumn >= 11")
            }
        }
        
        return conditions.joinToString(" OR ")
    }
}