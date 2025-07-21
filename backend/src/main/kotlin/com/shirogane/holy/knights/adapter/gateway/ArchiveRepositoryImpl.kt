package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant
import java.util.*

/**
 * アーカイブリポジトリの実装
 * Spring JdbcTemplateを使用してデータベースアクセスを実装
 */
import org.springframework.stereotype.Repository

/**
 * アーカイブリポジトリの実装
 * Spring JdbcTemplateを使用してデータベースアクセスを実装
 */
@Repository
class ArchiveRepositoryImpl(private val jdbcTemplate: JdbcTemplate) : ArchiveRepository {
    
    private val namedJdbcTemplate = NamedParameterJdbcTemplate(jdbcTemplate)
    
    /**
     * 全アーカイブを取得
     */
    override fun findAll(limit: Int, offset: Int): List<Archive> {
        
            val sql = """
                SELECT a.id, a.title, a.published_at,
                       v.url, v.duration, v.thumbnail_url,
                       c.description, c.is_members_only
                FROM archives a
                LEFT JOIN video_details v ON a.id = v.archive_id
                LEFT JOIN content_details c ON a.id = c.archive_id
                ORDER BY a.published_at DESC
                LIMIT ? OFFSET ?
            """.trimIndent()
            
            return jdbcTemplate.query(sql, arrayOf(limit, offset), archiveRowMapper())
    }
    
    /**
     * 総件数を取得
     */
    override fun count(): Int {
        
            return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM archives", Int::class.java) ?: 0
    }
    
    /**
     * IDによるアーカイブ取得
     */
    override fun findById(id: ArchiveId): Archive? {
        
            val sql = """
                SELECT a.id, a.title, a.published_at,
                       v.url, v.duration, v.thumbnail_url,
                       c.description, c.is_members_only
                FROM archives a
                LEFT JOIN video_details v ON a.id = v.archive_id
                LEFT JOIN content_details c ON a.id = c.archive_id
                WHERE a.id = ?
            """.trimIndent()
            
            try {
                return jdbcTemplate.queryForObject(sql, arrayOf(id.value), archiveRowMapper())
            } catch (e: Exception) {
                return null
            }
    }
    
    /**
     * 検索条件による検索
     */
    override fun search(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Archive> {
        
            // 検索クエリの構築
            val (sqlQuery, params) = buildSearchQuery(
                query = query,
                tags = tags,
                startDate = startDate,
                endDate = endDate,
                isCountQuery = false
            )
            
            val finalSql = """
                $sqlQuery
                ORDER BY published_at DESC
                LIMIT :limit OFFSET :offset
            """.trimIndent()
            
            val paramMap = MapSqlParameterSource(params).addValue("limit", limit).addValue("offset", offset)
            
            return namedJdbcTemplate.query(finalSql, paramMap, archiveRowMapper())
    }
    
    /**
     * 検索条件による総件数取得
     */
    override fun countBySearchCriteria(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        
            // 検索クエリの構築（COUNT用）
            val (sqlQuery, params) = buildSearchQuery(
                query = query,
                tags = tags,
                startDate = startDate,
                endDate = endDate,
                isCountQuery = true
            )
            
            return namedJdbcTemplate.queryForObject(sqlQuery, params, Int::class.java) ?: 0
    }
    
    /**
     * 関連アーカイブ取得
     */
    override fun getRelatedArchives(id: ArchiveId, limit: Int): List<Archive> {
        // IDから現在のアーカイブのタグを取得
        val currentTags = getArchiveTags(id.value)
        
        if (currentTags.isEmpty()) {
            // タグがない場合は最新のアーカイブを返す
            return findAll(limit, 0)
        }
            
            // タグの名前リストを作成
            val tagNames = currentTags.map { it.name }
            
            val sql = """
                SELECT a.id, a.title, a.published_at,
                       v.url, v.duration, v.thumbnail_url,
                       c.description, c.is_members_only,
                       COUNT(DISTINCT t.name) AS match_count
                FROM archives a
                LEFT JOIN video_details v ON a.id = v.archive_id
                LEFT JOIN content_details c ON a.id = c.archive_id
                JOIN archive_tags at ON a.id = at.archive_id
                JOIN tags t ON at.tag_id = t.id
                WHERE t.name IN (:tagNames) AND a.id != :archiveId
                GROUP BY a.id, a.title, a.published_at,
                         v.url, v.duration, v.thumbnail_url,
                         c.description, c.is_members_only
                ORDER BY match_count DESC, a.published_at DESC
                LIMIT :limit
            """.trimIndent()
            
            val params = MapSqlParameterSource()
                .addValue("tagNames", tagNames)
                .addValue("archiveId", id.value)
                .addValue("limit", limit)
            
        return namedJdbcTemplate.query(sql, params, archiveRowMapper())
    }
    
    /**
     * ResultSetからArchiveオブジェクトへのマッピング
     */
    private fun archiveRowMapper(): RowMapper<Archive> {
        return RowMapper { rs, _ ->
            val id = rs.getString("id")
            
            // VideoDetailsの構築
            val url = rs.getString("url")
            val videoDetails = if (url != null) {
                VideoDetails(
                    url = url,
                    duration = rs.getString("duration")?.let { Duration(it) },
                    thumbnailUrl = rs.getString("thumbnail_url")
                )
            } else null
            
            // ContentDetailsの構築
            val description = rs.getString("description")
            val contentDetails = if (description != null) {
                ContentDetails(
                    description = description,
                    isMembersOnly = rs.getBoolean("is_members_only")
                )
            } else null
            
            Archive(
                id = ArchiveId(id),
                title = rs.getString("title"),
                publishedAt = rs.getTimestamp("published_at").toInstant(),
                videoDetails = videoDetails,
                contentDetails = contentDetails,
                tags = getArchiveTags(id)
            )
        }
    }
    
    /**
     * アーカイブのタグを取得
     */
    private fun getArchiveTags(archiveId: String): List<Tag> {
        val sql = """
            SELECT t.name
            FROM tags t
            JOIN archive_tags at ON t.id = at.tag_id
            WHERE at.archive_id = ?
        """.trimIndent()
        
        return jdbcTemplate.query(sql, arrayOf(archiveId)) { rs, _ ->
            Tag(rs.getString("name"))
        }
    }
    
    /**
     * 検索クエリ構築ヘルパーメソッド
     * SQL文と、バインド変数の値のマップを返す
     */
    private fun buildSearchQuery(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        isCountQuery: Boolean
    ): Pair<String, Map<String, Any>> {
        val whereConditions = mutableListOf<String>()
        val params = mutableMapOf<String, Any>()
        
        // ベースクエリ
        val baseSelect = if (isCountQuery) {
            "SELECT COUNT(*) FROM archives a"
        } else {
            """
            SELECT a.id, a.title, a.published_at,
                   v.url, v.duration, v.thumbnail_url,
                   c.description, c.is_members_only
            FROM archives a
            LEFT JOIN video_details v ON a.id = v.archive_id
            LEFT JOIN content_details c ON a.id = c.archive_id
            """
        }
        
        // タイトル・説明の部分一致検索
        query?.let { q ->
            if (q.isNotBlank()) {
                whereConditions.add("(a.title ILIKE :query OR c.description ILIKE :query)")
                params["query"] = "%$q%"
            }
        }
        
        // 日付範囲検索
        startDate?.let { date ->
            whereConditions.add("a.published_at >= :startDate")
            params["startDate"] = Timestamp.from(date)
        }
        
        endDate?.let { date ->
            whereConditions.add("a.published_at <= :endDate")
            params["endDate"] = Timestamp.from(date)
        }
        
        // タグ検索
        tags?.let { tagList ->
            if (tagList.isNotEmpty()) {
                val tagPlaceholders = tagList.mapIndexed { index, _ -> ":tag$index" }.joinToString(", ")
                
                val tagCondition = """
                id IN (
                    SELECT archive_id 
                    FROM archive_tags at
                    JOIN tags t ON at.tag_id = t.id
                    WHERE t.name IN ($tagPlaceholders)
                    GROUP BY archive_id
                    HAVING COUNT(DISTINCT t.name) = ${tagList.size}
                )
                """
                
                whereConditions.add(tagCondition)
                
                tagList.forEachIndexed { index, tag ->
                    params["tag$index"] = tag
                }
            }
        }
        
        // WHERE句の構築
        val whereSql = if (whereConditions.isNotEmpty()) {
            "WHERE ${whereConditions.joinToString(" AND ")}"
        } else {
            ""
        }
        
        return Pair("$baseSelect $whereSql", params)
    }
}