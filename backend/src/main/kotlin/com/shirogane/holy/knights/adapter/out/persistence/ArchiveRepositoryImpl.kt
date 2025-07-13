package com.shirogane.holy.knights.adapter.out.persistence

import com.shirogane.holy.knights.domain.model.Archive
import com.shirogane.holy.knights.domain.model.ArchiveId
import com.shirogane.holy.knights.domain.model.Duration
import com.shirogane.holy.knights.domain.model.Tag
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import com.shirogane.holy.knights.infrastructure.database.DatabaseFactory
import java.sql.Connection
import java.sql.ResultSet
import java.sql.SQLException
import java.sql.Timestamp
import java.time.Instant

/**
 * アーカイブリポジトリの実装
 * データベースアクセスの詳細を実装
 */
class ArchiveRepositoryImpl : ArchiveRepository {
    
    /**
     * 全アーカイブを取得
     */
    override suspend fun findAll(limit: Int, offset: Int): List<Archive> {
        return DatabaseFactory.dbQuery { connection ->
            val statement = connection.prepareStatement("""
                SELECT id, title, url, published_at, description, duration, thumbnail_url
                FROM archives
                ORDER BY published_at DESC
                LIMIT ? OFFSET ?
            """.trimIndent())
            
            statement.setInt(1, limit)
            statement.setInt(2, offset)
            
            val resultSet = statement.executeQuery()
            val archives = mutableListOf<Archive>()
            
            while (resultSet.next()) {
                archives.add(mapRowToArchive(resultSet, connection))
            }
            
            archives
        }
    }
    
    /**
     * 総件数を取得
     */
    override suspend fun count(): Int {
        return DatabaseFactory.dbQuery { connection ->
            val statement = connection.prepareStatement("SELECT COUNT(*) FROM archives")
            val resultSet = statement.executeQuery()
            
            if (resultSet.next()) {
                resultSet.getInt(1)
            } else {
                0
            }
        }
    }
    
    /**
     * IDによるアーカイブ取得
     */
    override suspend fun findById(id: ArchiveId): Archive? {
        return DatabaseFactory.dbQuery { connection ->
            val statement = connection.prepareStatement("""
                SELECT id, title, url, published_at, description, duration, thumbnail_url
                FROM archives
                WHERE id = ?
            """.trimIndent())
            
            statement.setString(1, id.value)
            val resultSet = statement.executeQuery()
            
            if (resultSet.next()) {
                mapRowToArchive(resultSet, connection)
            } else {
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
        return DatabaseFactory.dbQuery { connection ->
            // 検索クエリの構築
            val (sqlQuery, parameters) = buildSearchQuery(
                query = query,
                tags = tags,
                startDate = startDate,
                endDate = endDate,
                isCountQuery = false
            )
            
            val finalSql = """
                $sqlQuery
                ORDER BY published_at DESC
                LIMIT ? OFFSET ?
            """.trimIndent()
            
            val statement = connection.prepareStatement(finalSql)
            
            // パラメータをセット
            var paramIndex = 1
            for (param in parameters) {
                when (param) {
                    is String -> statement.setString(paramIndex++, param)
                    is Timestamp -> statement.setTimestamp(paramIndex++, param)
                    else -> throw SQLException("サポートしていないパラメータタイプ: ${param.javaClass.name}")
                }
            }
            
            // LIMIT, OFFSETパラメータをセット
            statement.setInt(paramIndex++, limit)
            statement.setInt(paramIndex, offset)
            
            val resultSet = statement.executeQuery()
            val archives = mutableListOf<Archive>()
            
            while (resultSet.next()) {
                archives.add(mapRowToArchive(resultSet, connection))
            }
            
            archives
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
        return DatabaseFactory.dbQuery { connection ->
            // 検索クエリの構築（COUNT用）
            val (sqlQuery, parameters) = buildSearchQuery(
                query = query,
                tags = tags,
                startDate = startDate,
                endDate = endDate,
                isCountQuery = true
            )
            
            val statement = connection.prepareStatement(sqlQuery)
            
            // パラメータをセット
            var paramIndex = 1
            for (param in parameters) {
                when (param) {
                    is String -> statement.setString(paramIndex++, param)
                    is Timestamp -> statement.setTimestamp(paramIndex++, param)
                    else -> throw SQLException("サポートしていないパラメータタイプ: ${param.javaClass.name}")
                }
            }
            
            val resultSet = statement.executeQuery()
            
            if (resultSet.next()) {
                resultSet.getInt(1)
            } else {
                0
            }
        }
    }
    
    /**
     * 検索クエリ構築ヘルパーメソッド
     * SQL文と、バインド変数の値のリストを返す
     */
    private fun buildSearchQuery(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        isCountQuery: Boolean
    ): Pair<String, List<Any>> {
        val whereConditions = mutableListOf<String>()
        val parameters = mutableListOf<Any>()
        
        // ベースクエリ
        val baseSelect = if (isCountQuery) {
            "SELECT COUNT(*) FROM archives"
        } else {
            "SELECT id, title, url, published_at, description, duration, thumbnail_url FROM archives"
        }
        
        // タイトル・説明の部分一致検索
        query?.let { q ->
            if (q.isNotBlank()) {
                whereConditions.add("(title ILIKE ? OR description ILIKE ?)")
                parameters.add("%$q%")
                parameters.add("%$q%")
            }
        }
        
        // 日付範囲検索
        startDate?.let { date ->
            whereConditions.add("published_at >= ?")
            parameters.add(Timestamp.from(date))
        }
        
        endDate?.let { date ->
            whereConditions.add("published_at <= ?")
            parameters.add(Timestamp.from(date))
        }
        
        // タグ検索
        tags?.let { tagList ->
            if (tagList.isNotEmpty()) {
                val tagCondition = if (isCountQuery) {
                    // COUNT用クエリはサブクエリを使用
                    """
                    id IN (
                        SELECT archive_id 
                        FROM archive_tags at
                        JOIN tags t ON at.tag_id = t.id
                        WHERE t.name IN (${tagList.joinToString(", ") { "?" }})
                        GROUP BY archive_id
                        HAVING COUNT(DISTINCT t.name) = ${tagList.size}
                    )
                    """
                } else {
                    // 通常のクエリはJOINを使用
                    """
                    id IN (
                        SELECT archive_id 
                        FROM archive_tags at
                        JOIN tags t ON at.tag_id = t.id
                        WHERE t.name IN (${tagList.joinToString(", ") { "?" }})
                        GROUP BY archive_id
                        HAVING COUNT(DISTINCT t.name) = ${tagList.size}
                    )
                    """
                }
                whereConditions.add(tagCondition)
                parameters.addAll(tagList)
            }
        }
        
        // WHERE句の構築
        val whereSql = if (whereConditions.isNotEmpty()) {
            "WHERE ${whereConditions.joinToString(" AND ")}"
        } else {
            ""
        }
        
        return Pair("$baseSelect $whereSql", parameters)
    }
    
    /**
     * ResultSetからArchiveオブジェクトへのマッピング
     */
    private fun mapRowToArchive(resultSet: ResultSet, connection: Connection): Archive {
        val id = resultSet.getString("id")
        val title = resultSet.getString("title")
        val url = resultSet.getString("url")
        val publishedAt = resultSet.getTimestamp("published_at").toInstant()
        val description = resultSet.getString("description")
        val durationStr = resultSet.getString("duration")
        val thumbnailUrl = resultSet.getString("thumbnail_url")
        
        // タグ取得
        val tags = getArchiveTags(id, connection)
        
        return Archive(
            id = ArchiveId(id),
            title = title,
            url = url,
            publishedAt = publishedAt,
            description = description,
            tags = tags,
            duration = durationStr?.let { Duration(it) },
            thumbnailUrl = thumbnailUrl
        )
    }
    
    /**
     * アーカイブのタグを取得
     */
    private fun getArchiveTags(archiveId: String, connection: Connection): List<Tag> {
        val statement = connection.prepareStatement("""
            SELECT t.name
            FROM tags t
            JOIN archive_tags at ON t.id = at.tag_id
            WHERE at.archive_id = ?
        """.trimIndent())
        
        statement.setString(1, archiveId)
        val resultSet = statement.executeQuery()
        val tags = mutableListOf<Tag>()
        
        while (resultSet.next()) {
            tags.add(Tag(resultSet.getString("name")))
        }
        
        return tags
    }
}