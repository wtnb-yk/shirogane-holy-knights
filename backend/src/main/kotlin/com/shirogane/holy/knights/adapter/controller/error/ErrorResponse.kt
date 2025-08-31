package com.shirogane.holy.knights.adapter.controller.error

import com.fasterxml.jackson.annotation.JsonProperty

data class ErrorResponse(
    @field:JsonProperty("code", required = true)
    val code: String,

    @field:JsonProperty("message", required = true)
    val message: String
)
