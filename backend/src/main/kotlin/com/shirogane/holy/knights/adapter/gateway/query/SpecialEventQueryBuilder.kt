package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.model.SpecialEventSearchCriteria
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class SpecialEventQueryBuilder : QueryBuilder<SpecialEventSearchCriteria> {

    override fun buildSearchQuery(criteria: SpecialEventSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.status,
            criteria.startDate,
            criteria.endDate
        )

        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""

        val sql = """
            SELECT
                id, title, description, start_date, end_date, created_at
            FROM special_events
            $whereClause
            ORDER BY start_date DESC, created_at DESC
            LIMIT :limit OFFSET :offset
        """.trimIndent()

        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset
        )

        return QuerySpec(sql, bindings)
    }

    override fun buildCountQuery(criteria: SpecialEventSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.status,
            criteria.startDate,
            criteria.endDate
        )

        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""

        val sql = """
            SELECT COUNT(*)
            FROM special_events
            $whereClause
        """.trimIndent()

        return QuerySpec(sql, conditions.second)
    }

    fun buildGetByIdQuery(eventId: String): QuerySpec {
        val sql = """
            SELECT
                id, title, description, start_date, end_date, created_at
            FROM special_events
            WHERE id = :eventId
        """.trimIndent()

        return QuerySpec(sql, mapOf("eventId" to eventId))
    }

    private fun buildSearchConditions(
        status: String?,
        startDate: LocalDate?,
        endDate: LocalDate?
    ): Pair<List<String>, Map<String, Any>> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()

        // ステータスによるフィルタリング
        status?.let {
            val today = LocalDate.now()
            when (it.uppercase()) {
                "UPCOMING" -> {
                    conditions.add("start_date > :today")
                    bindings["today"] = today
                }
                "ACTIVE" -> {
                    conditions.add("start_date <= :today AND end_date >= :today")
                    bindings["today"] = today
                }
                "ENDED" -> {
                    conditions.add("end_date < :today")
                    bindings["today"] = today
                }
            }
        }

        // 開始日によるフィルタリング
        startDate?.let {
            conditions.add("start_date >= :startDate")
            bindings["startDate"] = it
        }

        // 終了日によるフィルタリング
        endDate?.let {
            conditions.add("end_date <= :endDate")
            bindings["endDate"] = it
        }

        return Pair(conditions, bindings)
    }
}