package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec

interface QueryBuilder<T> {
    fun buildSearchQuery(criteria: T): QuerySpec
    fun buildCountQuery(criteria: T): QuerySpec
}