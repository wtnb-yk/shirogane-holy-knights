package com.shirogane.holy.knights.adapter.gateway.model

import java.time.Instant

data class NewsSearchCriteria(
    val query: String?,
    val categoryIds: List<Int>?,
    val startDate: Instant?,
    val endDate: Instant?,
    val limit: Int,
    val offset: Int
)