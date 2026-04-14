package com.shirogane.holy.knights.adapter.controller.error

import com.shirogane.holy.knights.adapter.controller.ApiResponse
import com.shirogane.holy.knights.application.usecase.UseCaseError
import com.shirogane.holy.knights.domain.error.ErrorCode

interface ErrorController {
    fun UseCaseError.toResponse(): ApiResponse {
        val errorCode = this.errorCode ?: ErrorCode.INTERNAL_SERVER_ERROR
        return ApiResponse(
            400,
            ErrorResponse(
            code = errorCode.code,
            message = this.message
        ))
    }
}
