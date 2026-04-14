package com.shirogane.holy.knights.adapter.controller.error

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.Instant

data class ErrorResponse(
    @field:JsonProperty("code", required = true)
    val code: String,

    @field:JsonProperty("message", required = true)
    val message: String,

    @field:JsonProperty("timestamp", required = true)
    val timestamp: String = Instant.now().toString(),

    @field:JsonProperty("traceId")
    val traceId: String? = null
)
