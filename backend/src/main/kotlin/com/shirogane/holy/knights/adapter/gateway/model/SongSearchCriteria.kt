package com.shirogane.holy.knights.adapter.gateway.model

import com.shirogane.holy.knights.domain.model.SingFrequencyCategory
import java.time.Instant

data class SongSearchCriteria(
    val query: String?,
    val sortBy: String,
    val sortOrder: String,
    val startDate: Instant?,
    val endDate: Instant?,
    val frequencyCategories: List<SingFrequencyCategory>?,
    val limit: Int,
    val offset: Int
)