package com.shirogane.holy.knights.adapter.gateway.model

import java.time.Instant

data class StreamSearchCriteria(
    val query: String?,
    val tags: List<String>?,
    val startDate: Instant?,
    val endDate: Instant?,
    val limit: Int,
    val offset: Int
)