package com.shirogane.holy.knights.application.usecase

data class UseCaseError (
//    val errorCode: String,
    val message: String,
    val cause: Throwable? = null
)
