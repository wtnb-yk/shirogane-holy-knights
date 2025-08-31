package com.shirogane.holy.knights.adapter.controller.error

import com.shirogane.holy.knights.application.usecase.UseCaseError

interface ErrorController {
    suspend fun UseCaseError.toResponse() {

    }
}
