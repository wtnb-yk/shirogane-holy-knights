package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.mapper.RowMapper

interface R2dbcQueryExecutor {
    suspend fun <T> execute(querySpec: QuerySpec, mapper: RowMapper<T>): List<T>
    suspend fun <T> executeSingle(querySpec: QuerySpec, mapper: RowMapper<T>): T
    suspend fun executeCount(querySpec: QuerySpec): Int
}