package com.shirogane.holy.knights.application.usecase

import arrow.core.Either
import arrow.core.raise.either
import com.shirogane.holy.knights.adapter.controller.dto.SpecialEventDto
import com.shirogane.holy.knights.adapter.controller.dto.SpecialEventSearchResultDto
import com.shirogane.holy.knights.adapter.controller.port.SpecialsUseCasePort
import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.repository.SpecialEventRepository
import org.springframework.stereotype.Service

@Service
class SpecialsUseCaseImpl(
    private val specialEventRepository: SpecialEventRepository
) : SpecialsUseCasePort {

    override suspend fun getSpecialEvents(): Either<UseCaseError, SpecialEventSearchResultDto> =
        either {
            val pageRequest = PageRequest(1, 20) // デフォルトのページング設定

            val specialEvents = specialEventRepository.findAll(
                limit = pageRequest.size,
                offset = pageRequest.offset
            )

            val totalCount = specialEventRepository.count()

            val specialEventDtos = specialEvents.map { SpecialEventDto.fromDomain(it) }
            SpecialEventSearchResultDto.of(specialEventDtos, totalCount, pageRequest)
        }

    override suspend fun getSpecialEventDetails(eventId: String): Either<UseCaseError, SpecialEventDto> =
        either {
            val specialEvent = specialEventRepository.findById(SpecialEventId(eventId))
                ?: raise(UseCaseError(message = "指定されたスペシャルイベントが見つかりません"))

            SpecialEventDto.fromDomain(specialEvent)
        }
}