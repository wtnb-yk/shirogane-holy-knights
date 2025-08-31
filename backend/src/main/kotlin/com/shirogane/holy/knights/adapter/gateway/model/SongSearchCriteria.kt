package com.shirogane.holy.knights.adapter.gateway.model

import java.time.Instant

data class SongSearchCriteria(
    val query: String?,
    val sortBy: String,
    val sortOrder: String,
    val startDate: Instant?,
    val endDate: Instant?,
    val limit: Int,
    val offset: Int
)