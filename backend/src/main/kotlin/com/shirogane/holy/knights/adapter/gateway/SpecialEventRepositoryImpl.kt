package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.SpecialEvent
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.model.SpecialEventStatus
import com.shirogane.holy.knights.domain.model.SpecialEvents
import com.shirogane.holy.knights.domain.repository.SpecialEventRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
class SpecialEventRepositoryImpl : SpecialEventRepository {

    // TODO: 実際のデータベース実装に置き換える
    private val mockEvents = listOf(
        SpecialEvent(
            id = SpecialEventId("1"),
            title = "Birthday Celebration 2024",
            description = "Special birthday celebration event with exclusive content and activities",
            startDate = LocalDate.of(2024, 12, 1),
            endDate = LocalDate.of(2024, 12, 31),
            status = SpecialEventStatus.UPCOMING
        ),
        SpecialEvent(
            id = SpecialEventId("2"),
            title = "Anniversary Special",
            description = "Commemorating important milestones with special performances and content",
            startDate = LocalDate.of(2024, 11, 15),
            endDate = LocalDate.of(2024, 11, 30),
            status = SpecialEventStatus.ACTIVE
        ),
        SpecialEvent(
            id = SpecialEventId("3"),
            title = "Summer Festival 2024",
            description = "Summer special event featuring exclusive music and collaborations",
            startDate = LocalDate.of(2024, 7, 1),
            endDate = LocalDate.of(2024, 8, 31),
            status = SpecialEventStatus.ENDED
        )
    )

    override suspend fun findAll(limit: Int, offset: Int): SpecialEvents {
        val events = mockEvents
            .drop(offset)
            .take(limit)
        return SpecialEvents(events)
    }

    override suspend fun count(): Int {
        return mockEvents.size
    }

    override suspend fun findById(eventId: SpecialEventId): SpecialEvent? {
        return mockEvents.find { it.id == eventId }
    }
}