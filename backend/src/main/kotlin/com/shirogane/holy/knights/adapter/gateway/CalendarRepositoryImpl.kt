package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.Events
import com.shirogane.holy.knights.domain.model.EventType
import com.shirogane.holy.knights.domain.repository.CalendarRepository
import com.shirogane.holy.knights.adapter.gateway.entity.EventTypeEntity
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.adapter.gateway.query.CalendarQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.mapper.CalendarRowMapper
import com.shirogane.holy.knights.adapter.gateway.model.CalendarSearchCriteria
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Query
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
class CalendarRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val calendarQueryBuilder: CalendarQueryBuilder,
    private val calendarRowMapper: CalendarRowMapper,
    private val template: R2dbcEntityTemplate
) : CalendarRepository {

    override suspend fun search(
        query: String?,
        eventTypeIds: List<Int>?,
        startDate: LocalDate?,
        endDate: LocalDate?,
        limit: Int,
        offset: Int
    ): Events {
        val criteria = CalendarSearchCriteria(
            query = query,
            eventTypeIds = eventTypeIds,
            startDate = startDate,
            endDate = endDate,
            limit = limit,
            offset = offset
        )

        val querySpec = calendarQueryBuilder.buildSearchQuery(criteria)
        val eventsList = queryExecutor.execute(querySpec, calendarRowMapper)

        return Events(eventsList)
    }

    override suspend fun countBySearchCriteria(
        query: String?,
        eventTypeIds: List<Int>?,
        startDate: LocalDate?,
        endDate: LocalDate?
    ): Int {
        val criteria = CalendarSearchCriteria(
            query = query,
            eventTypeIds = eventTypeIds,
            startDate = startDate,
            endDate = endDate,
            limit = 0,
            offset = 0
        )

        val querySpec = calendarQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun findAllEventTypes(): List<EventType> {
        val eventTypes = template
            .select(EventTypeEntity::class.java)
            .matching(Query.empty().sort(Sort.by(Sort.Direction.ASC, "id")))
            .all()
            .collectList()
            .awaitSingle()

        return eventTypes.map { it.toDomain() }
    }
}
