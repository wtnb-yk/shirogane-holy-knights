package com.shirogane.holy.knights.adapter.controller.error

import com.shirogane.holy.knights.application.usecase.UseCaseError
import com.shirogane.holy.knights.domain.error.ErrorCode

interface ErrorController {
    fun UseCaseError.toResponse(): ErrorResponse {
        val errorCode = this.errorCode ?: ErrorCode.INTERNAL_SERVER_ERROR
        return ErrorResponse(
            code = errorCode.code,
            message = this.message
        )
    }
}
