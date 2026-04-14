package com.shirogane.holy.knights.adapter.gateway

data class QuerySpec(
    val sql: String,
    val bindings: Map<String, Any>
)

data class SearchConditions(
    val conditions: List<String>,
    val bindings: Map<String, Any>
)