package com.shirogane.holy.knights.adapter.out.persistence

import com.shirogane.holy.knights.domain.model.Archive
import com.shirogane.holy.knights.domain.model.ArchiveId
import com.shirogane.holy.knights.domain.model.Duration
import com.shirogane.holy.knights.domain.model.Tag
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
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
class ArchiveRepositoryImpl(private val jdbcTemplate: JdbcTemplate) : ArchiveRepository {
    
    private val namedJdbcTemplate = NamedParameterJdbcTemplate(jdbcTemplate)
    
    /**
     * 全アーカイブを取得
     */
    override suspend fun findAll(limit: Int, offset: Int): List<Archive> {
        return withContext(Dispatchers.IO) {
            val sql = """
                SELECT id, title, url, published_at, description, duration, thumbnail_url
                FROM archives
                ORDER BY published_at DESC
                LIMIT ? OFFSET ?
            """.trimIndent()
            
            jdbcTemplate.query(sql, arrayOf(limit, offset), archiveRowMapper())
        }
    }
    
    /**
     * 総件数を取得
     */
    override suspend fun count(): Int {
        return withContext(Dispatchers.IO) {
            jdbcTemplate.queryForObject("SELECT COUNT(*) FROM archives", Int::class.java) ?: 0
        }
    }
    
    /**
     * IDによるアーカイブ取得
     */
    override suspend fun findById(id: ArchiveId): Archive? {
        return withContext(Dispatchers.IO) {
            val sql = """
                SELECT id, title, url, published_at, description, duration, thumbnail_url
                FROM archives
                WHERE id = ?
            """.trimIndent()
            
            try {
                jdbcTemplate.queryForObject(sql, arrayOf(id.value), archiveRowMapper())
            } catch (e: Exception) {
                null
            }
        }
    }
    
    /**
     * 検索条件による検索
     */
    override suspend fun search(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Archive> {
        return withContext(Dispatchers.IO) {
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
            
            namedJdbcTemplate.query(finalSql, paramMap, archiveRowMapper())
        }
    }
    
    /**
     * 検索条件による総件数取得
     */
    override suspend fun countBySearchCriteria(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        return withContext(Dispatchers.IO) {
            // 検索クエリの構築（COUNT用）
            val (sqlQuery, params) = buildSearchQuery(
                query = query,
                tags = tags,
                startDate = startDate,
                endDate = endDate,
                isCountQuery = true
            )
            
            namedJdbcTemplate.queryForObject(sqlQuery, params, Int::class.java) ?: 0
        }
    }
    
    /**
     * 関連アーカイブ取得
     */
    override suspend fun getRelatedArchives(id: ArchiveId, limit: Int): List<Archive> {
        return withContext(Dispatchers.IO) {
            // IDから現在のアーカイブのタグを取得
            val currentTags = getArchiveTags(id.value)
            
            if (currentTags.isEmpty()) {
                // タグがない場合は最新のアーカイブを返す
                return@withContext findAll(limit, 0)
            }
            
            // タグの名前リストを作成
            val tagNames = currentTags.map { it.name }
            
            val sql = """
                SELECT a.id, a.title, a.url, a.published_at, a.description, 
                       a.duration, a.thumbnail_url, COUNT(DISTINCT t.name) AS match_count
                FROM archives a
                JOIN archive_tags at ON a.id = at.archive_id
                JOIN tags t ON at.tag_id = t.id
                WHERE t.name IN (:tagNames) AND a.id != :archiveId
                GROUP BY a.id, a.title, a.url, a.published_at, a.description, 
                         a.duration, a.thumbnail_url
                ORDER BY match_count DESC, a.published_at DESC
                LIMIT :limit
            """.trimIndent()
            
            val params = MapSqlParameterSource()
                .addValue("tagNames", tagNames)
                .addValue("archiveId", id.value)
                .addValue("limit", limit)
            
            namedJdbcTemplate.query(sql, params, archiveRowMapper())
        }
    }
    
    /**
     * ResultSetからArchiveオブジェクトへのマッピング
     */
    private fun archiveRowMapper(): RowMapper<Archive> {
        return RowMapper { rs, _ ->
            val id = rs.getString("id")
            
            Archive(
                id = ArchiveId(id),
                title = rs.getString("title"),
                url = rs.getString("url"),
                publishedAt = rs.getTimestamp("published_at").toInstant(),
                description = rs.getString("description"),
                tags = getArchiveTags(id),
                duration = rs.getString("duration")?.let { Duration(it) },
                thumbnailUrl = rs.getString("thumbnail_url")
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
            "SELECT COUNT(*) FROM archives"
        } else {
            "SELECT id, title, url, published_at, description, duration, thumbnail_url FROM archives"
        }
        
        // タイトル・説明の部分一致検索
        query?.let { q ->
            if (q.isNotBlank()) {
                whereConditions.add("(title ILIKE :query OR description ILIKE :query)")
                params["query"] = "%$q%"
            }
        }
        
        // 日付範囲検索
        startDate?.let { date ->
            whereConditions.add("published_at >= :startDate")
            params["startDate"] = Timestamp.from(date)
        }
        
        endDate?.let { date ->
            whereConditions.add("published_at <= :endDate")
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