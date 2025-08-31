package com.shirogane.holy.knights.adapter.gateway.mapper

import io.r2dbc.spi.Row

interface RowMapper<T> {
    fun map(row: Row): T
}