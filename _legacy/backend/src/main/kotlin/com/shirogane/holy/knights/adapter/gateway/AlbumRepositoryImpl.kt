package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.AlbumRepository
import com.shirogane.holy.knights.adapter.gateway.entity.AlbumTypeEntity
import com.shirogane.holy.knights.adapter.gateway.query.R2dbcQueryExecutor
import com.shirogane.holy.knights.adapter.gateway.query.AlbumQueryBuilder
import com.shirogane.holy.knights.adapter.gateway.mapper.AlbumRowMapper
import com.shirogane.holy.knights.adapter.gateway.model.AlbumSearchCriteria
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Query
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
class AlbumRepositoryImpl(
    private val queryExecutor: R2dbcQueryExecutor,
    private val albumQueryBuilder: AlbumQueryBuilder,
    private val albumRowMapper: AlbumRowMapper,
    private val template: R2dbcEntityTemplate
) : AlbumRepository {

    override suspend fun search(
        query: String?,
        albumTypes: List<String>?,
        startDate: LocalDate?,
        endDate: LocalDate?,
        sortBy: String,
        sortOrder: String,
        limit: Int,
        offset: Int
    ): Albums {
        val criteria = AlbumSearchCriteria(
            query = query,
            albumTypes = albumTypes,
            startDate = startDate,
            endDate = endDate,
            sortBy = sortBy,
            sortOrder = sortOrder,
            limit = limit,
            offset = offset
        )

        val querySpec = albumQueryBuilder.buildSearchQuery(criteria)
        val albumsList = queryExecutor.execute(querySpec, albumRowMapper)

        return Albums(albumsList)
    }

    override suspend fun countBySearchCriteria(
        query: String?,
        albumTypes: List<String>?,
        startDate: LocalDate?,
        endDate: LocalDate?
    ): Int {
        val criteria = AlbumSearchCriteria(
            query = query,
            albumTypes = albumTypes,
            startDate = startDate,
            endDate = endDate,
            limit = 0,
            offset = 0
        )

        val querySpec = albumQueryBuilder.buildCountQuery(criteria)
        return queryExecutor.executeCount(querySpec)
    }

    override suspend fun findById(albumId: AlbumId): Album? {
        val querySpec = albumQueryBuilder.buildGetByIdQuery(albumId.value)
        val albums = queryExecutor.execute(querySpec, albumRowMapper)
        return albums.firstOrNull()
    }

    override suspend fun findAllAlbumTypes(): List<AlbumType> {
        val albumTypes = template
            .select(AlbumTypeEntity::class.java)
            .matching(Query.empty().sort(Sort.by(Sort.Direction.ASC, "id")))
            .all()
            .collectList()
            .awaitSingle()

        return albumTypes.map { it.toDomain() }
    }
}