package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.adapter.gateway.mapper.MessageRowMapper
import com.shirogane.holy.knights.adapter.gateway.query.MessageQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.domain.model.Messages
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.repository.MessageRepository
import org.springframework.stereotype.Repository

@Repository
class MessageRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val messageQueryBuilder: MessageQueryBuilder,
    private val messageRowMapper: MessageRowMapper
) : MessageRepository {

    override suspend fun findBySpecialEventId(specialEventId: SpecialEventId): Messages {
        val querySpec = messageQueryBuilder.buildGetBySpecialEventIdQuery(specialEventId.value)
        val messagesList = queryExecutor.execute(querySpec, messageRowMapper)
        return Messages(messagesList)
    }
}
