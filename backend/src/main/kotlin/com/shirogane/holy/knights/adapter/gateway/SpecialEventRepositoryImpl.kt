package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.SpecialEvent
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.model.SpecialEvents
import com.shirogane.holy.knights.domain.repository.SpecialEventRepository
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.adapter.gateway.query.SpecialEventQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.mapper.SpecialEventRowMapper
import com.shirogane.holy.knights.adapter.gateway.model.SpecialEventSearchCriteria
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Repository

@Repository
class SpecialEventRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val specialEventQueryBuilder: SpecialEventQueryBuilder,
    private val specialEventRowMapper: SpecialEventRowMapper,
    private val template: R2dbcEntityTemplate
) : SpecialEventRepository {

    override suspend fun findAll(limit: Int, offset: Int): SpecialEvents {
        val criteria = SpecialEventSearchCriteria(
            limit = limit,
            offset = offset
        )

        val querySpec = specialEventQueryBuilder.buildSearchQuery(criteria)
        val eventsList = queryExecutor.execute(querySpec, specialEventRowMapper)

        return SpecialEvents(eventsList)
    }

    override suspend fun count(): Int {
        val criteria = SpecialEventSearchCriteria(
            limit = 0,
            offset = 0
        )

        val querySpec = specialEventQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun findById(eventId: SpecialEventId): SpecialEvent? {
        val querySpec = specialEventQueryBuilder.buildGetByIdQuery(eventId.value)
        val events = queryExecutor.execute(querySpec, specialEventRowMapper)
        return events.firstOrNull()
    }
}