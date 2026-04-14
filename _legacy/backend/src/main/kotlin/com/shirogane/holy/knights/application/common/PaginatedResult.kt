package com.shirogane.holy.knights.application.common

interface PaginatedResult<T> {
    val items: List<T>
    val totalCount: Int
    val page: Int
    val pageSize: Int
    
    val hasMore: Boolean
        get() = page * pageSize < totalCount
}
