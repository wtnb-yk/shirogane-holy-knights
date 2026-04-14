package com.shirogane.holy.knights.adapter.gateway.model

import java.time.LocalDate

/**
 * アルバム検索条件
 */
data class AlbumSearchCriteria(
    val query: String? = null,
    val albumTypes: List<String>? = null,
    val startDate: LocalDate? = null,
    val endDate: LocalDate? = null,
    val sortBy: String = "releaseDate",
    val sortOrder: String = "DESC",
    val limit: Int,
    val offset: Int
)