package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.error.ErrorController

interface Controller: ErrorController {
    val objectMapper: ObjectMapper
    
    fun <T> parseRequestBody(body: String?, clazz: Class<T>): T? {
        return when {
            body == null || body.isBlank() -> null
            else -> objectMapper.readValue(body, clazz)
        }
    }
}
