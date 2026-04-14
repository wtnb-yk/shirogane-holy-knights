package com.shirogane.holy.knights.adapter.controller.error

data class RequestError(
    val message: String,
    val cause: Throwable? = null
)
