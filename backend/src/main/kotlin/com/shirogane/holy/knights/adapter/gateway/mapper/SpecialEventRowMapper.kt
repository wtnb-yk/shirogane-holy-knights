package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.SpecialEvent
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.model.SpecialEventStatus
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.LocalDate

/**
 * スペシャルイベント関連のRowMapper
 */
@Component
class SpecialEventRowMapper : RowMapper<SpecialEvent> {

    override fun map(row: Row): SpecialEvent {
        val startDate = row.get("start_date", LocalDate::class.java)!!
        val endDate = row.get("end_date", LocalDate::class.java)!!
        
        val now = LocalDate.now()
        
        val status = when {
            now < startDate -> SpecialEventStatus.UPCOMING
            now > endDate -> SpecialEventStatus.ENDED
            else -> SpecialEventStatus.ACTIVE
        }

        return SpecialEvent(
            id = SpecialEventId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            description = row.get("description", String::class.java) ?: "",
            startDate = startDate,
            endDate = endDate,
            status = status
        )
    }
}