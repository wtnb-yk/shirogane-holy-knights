package com.shirogane.holy.knights.adapter.gateway.model

import java.time.LocalDate

/**
 * カレンダー検索条件
 * NewsSearchCriteriaと同じパターンで実装
 */
data class CalendarSearchCriteria(
    val eventTypeIds: List<Int>? = null,
    val startDate: LocalDate? = null,
    val endDate: LocalDate? = null,
    val limit: Int,
    val offset: Int
)