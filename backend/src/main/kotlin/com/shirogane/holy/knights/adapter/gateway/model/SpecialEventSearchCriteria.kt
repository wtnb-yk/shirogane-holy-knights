package com.shirogane.holy.knights.adapter.gateway.model

import java.time.LocalDate

/**
 * スペシャルイベント検索条件
 */
data class SpecialEventSearchCriteria(
    val status: String? = null,
    val startDate: LocalDate? = null,
    val endDate: LocalDate? = null,
    val limit: Int,
    val offset: Int
)