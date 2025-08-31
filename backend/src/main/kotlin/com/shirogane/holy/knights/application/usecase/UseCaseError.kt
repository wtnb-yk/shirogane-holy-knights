package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.domain.error.ErrorCode

data class UseCaseError (
    val errorCode: ErrorCode? = null,
    val message: String,
    val cause: Throwable? = null
)
