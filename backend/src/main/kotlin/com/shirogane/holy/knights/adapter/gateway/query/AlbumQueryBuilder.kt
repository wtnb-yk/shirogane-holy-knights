package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.model.AlbumSearchCriteria
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class AlbumQueryBuilder : QueryBuilder<AlbumSearchCriteria> {

    override fun buildSearchQuery(criteria: AlbumSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.albumTypes,
            criteria.startDate,
            criteria.endDate
        )

        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""

        val orderClause = buildOrderClause(criteria.sortBy, criteria.sortOrder)

        val sql = """
            SELECT
                a.id, a.title, a.artist, a.album_type_id, a.release_date, a.cover_image_url,
                at.type_name as album_type_name,
                at.description as album_type_description,
                COALESCE(STRING_AGG(DISTINCT CONCAT(s.id, ':', s.title, ':', s.artist, ':', als.track_number), '|' ORDER BY als.track_number), '') as tracks,
                COALESCE(STRING_AGG(DISTINCT CONCAT(mr.id, ':', mr.platform_name, ':', mr.platform_url, ':', COALESCE(mr.platform_icon_url, ''), ':', mr.release_date), '|'), '') as music_releases
            FROM albums a
            LEFT JOIN album_types at ON a.album_type_id = at.id
            LEFT JOIN album_songs als ON a.id = als.album_id
            LEFT JOIN songs s ON als.song_id = s.id
            LEFT JOIN music_releases mr ON a.id = mr.album_id
            $whereClause
            GROUP BY a.id, a.title, a.artist, a.album_type_id, a.release_date, a.cover_image_url, at.type_name, at.description
            $orderClause
            LIMIT :limit OFFSET :offset
        """.trimIndent()

        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset
        )

        return QuerySpec(sql, bindings)
    }

    override fun buildCountQuery(criteria: AlbumSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.query,
            criteria.albumTypes,
            criteria.startDate,
            criteria.endDate
        )

        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""

        val sql = """
            SELECT COUNT(DISTINCT a.id)
            FROM albums a
            LEFT JOIN album_types at ON a.album_type_id = at.id
            $whereClause
        """.trimIndent()

        return QuerySpec(sql, conditions.second)
    }

    fun buildGetByIdQuery(albumId: String): QuerySpec {
        val sql = """
            SELECT
                a.id, a.title, a.artist, a.album_type_id, a.release_date, a.cover_image_url,
                at.type_name as album_type_name,
                at.description as album_type_description,
                COALESCE(STRING_AGG(DISTINCT CONCAT(s.id, ':', s.title, ':', s.artist, ':', als.track_number), '|' ORDER BY als.track_number), '') as tracks,
                COALESCE(STRING_AGG(DISTINCT CONCAT(mr.id, ':', mr.platform_name, ':', mr.platform_url, ':', COALESCE(mr.platform_icon_url, ''), ':', mr.release_date), '|'), '') as music_releases
            FROM albums a
            LEFT JOIN album_types at ON a.album_type_id = at.id
            LEFT JOIN album_songs als ON a.id = als.album_id
            LEFT JOIN songs s ON als.song_id = s.id
            LEFT JOIN music_releases mr ON a.id = mr.album_id
            WHERE a.id = :albumId
            GROUP BY a.id, a.title, a.artist, a.album_type_id, a.release_date, a.cover_image_url, at.type_name, at.description
        """.trimIndent()

        return QuerySpec(sql, mapOf("albumId" to albumId))
    }

    private fun buildSearchConditions(
        query: String?,
        albumTypes: List<String>?,
        startDate: LocalDate?,
        endDate: LocalDate?
    ): Pair<List<String>, Map<String, Any>> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()

        query?.takeIf { it.isNotBlank() }?.let {
            conditions.add("(a.title ILIKE :query OR a.artist ILIKE :query)")
            bindings["query"] = "%$it%"
        }

        albumTypes?.takeIf { it.isNotEmpty() }?.let {
            conditions.add("at.type_name = ANY(:albumTypes)")
            bindings["albumTypes"] = it.toTypedArray()
        }

        startDate?.let {
            conditions.add("a.release_date >= :startDate")
            bindings["startDate"] = it
        }

        endDate?.let {
            conditions.add("a.release_date <= :endDate")
            bindings["endDate"] = it
        }

        return Pair(conditions, bindings)
    }

    private fun buildOrderClause(sortBy: String, sortOrder: String): String {
        val direction = if (sortOrder.uppercase() == "ASC") "ASC" else "DESC"

        val column = when (sortBy) {
            "title" -> "a.title"
            "artist" -> "a.artist"
            "releaseDate" -> "a.release_date"
            else -> "a.release_date"
        }

        return "ORDER BY $column $direction"
    }
}