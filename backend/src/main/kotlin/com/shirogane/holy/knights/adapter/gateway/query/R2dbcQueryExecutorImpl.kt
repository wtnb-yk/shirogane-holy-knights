package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.mapper.RowMapper
import io.r2dbc.spi.Row
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Component

@Component
class R2dbcQueryExecutorImpl(
    private val template: R2dbcEntityTemplate
) : R2dbcQueryExecutor {
    
    override suspend fun <T> execute(querySpec: QuerySpec, mapper: RowMapper<T>): List<T> {
        val sqlQuery = bindParameters(querySpec)
        
        return sqlQuery.map { row -> mapper.map(row as Row) }
            .all()
            .collectList()
            .awaitSingle()
    }
    
    override suspend fun <T> executeSingle(querySpec: QuerySpec, mapper: RowMapper<T>): T {
        val sqlQuery = bindParameters(querySpec)
        
        return sqlQuery.map { row -> mapper.map(row as Row) }
            .one()
            .awaitSingle()
    }
    
    override suspend fun executeCount(querySpec: QuerySpec): Int {
        val sqlQuery = bindParameters(querySpec)
        
        return sqlQuery.map { row -> (row.get(0) as Number).toInt() }
            .one()
            .awaitSingle()
    }
    
    private fun bindParameters(querySpec: QuerySpec): org.springframework.r2dbc.core.DatabaseClient.GenericExecuteSpec {
        var result = template.databaseClient.sql(querySpec.sql)
        querySpec.bindings.forEach { (key, value) ->
            result = result.bind(key, value)
        }
        return result
    }
}