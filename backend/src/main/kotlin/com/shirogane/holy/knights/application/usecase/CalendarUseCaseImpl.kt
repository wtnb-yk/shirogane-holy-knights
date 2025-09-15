package com.shirogane.holy.knights.application.usecase

import arrow.core.Either
import arrow.core.raise.either
import com.shirogane.holy.knights.adapter.controller.dto.EventDto
import com.shirogane.holy.knights.adapter.controller.dto.EventSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.EventSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.EventTypeDto
import com.shirogane.holy.knights.adapter.controller.port.CalendarUseCasePort
import com.shirogane.holy.knights.domain.repository.CalendarRepository
import org.springframework.stereotype.Service

@Service
class CalendarUseCaseImpl(
    private val calendarRepository: CalendarRepository
) : CalendarUseCasePort {

    override suspend fun searchEvents(params: EventSearchParamsDto): Either<UseCaseError, EventSearchResultDto> =
        either {
            val pageRequest = params.toPageRequest()
            val startDate = params.getStartDateAsLocalDate()
            val endDate = params.getEndDateAsLocalDate()

            val events = calendarRepository.search(
                query = params.query,
                eventTypeIds = params.eventTypeIds,
                startDate = startDate,
                endDate = endDate,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )

            val totalCount = calendarRepository.countBySearchCriteria(
                query = params.query,
                eventTypeIds = params.eventTypeIds,
                startDate = startDate,
                endDate = endDate
            )

            val eventDtos = events.map { EventDto.fromDomain(it) }
            EventSearchResultDto.of(eventDtos, totalCount, pageRequest)
        }

    override suspend fun getEventTypes(): List<EventTypeDto> {
        val eventTypes = calendarRepository.findAllEventTypes()
        return eventTypes.map { EventTypeDto.fromDomain(it) }
    }
}