package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.application.common.PaginatedResult
import com.shirogane.holy.knights.domain.model.SpecialEvent
import kotlinx.serialization.Serializable

/**
 * スペシャルイベントDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class SpecialEventDto(
    val id: String,
    val title: String,
    val description: String,
    val startDate: String, // YYYY-MM-DD形式
    val endDate: String,   // YYYY-MM-DD形式
    val status: String,    // "upcoming", "active", "ended"
    val eventTypes: List<String> = emptyList()
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(specialEvent: SpecialEvent): SpecialEventDto {
            return SpecialEventDto(
                id = specialEvent.id.value,
                title = specialEvent.title,
                description = specialEvent.description,
                startDate = specialEvent.startDate.toString(), // YYYY-MM-DD
                endDate = specialEvent.endDate.toString(),     // YYYY-MM-DD
                status = specialEvent.status.name.lowercase(),
                eventTypes = specialEvent.eventTypes.map { it.type }
            )
        }
    }
}

/**
 * スペシャルイベント検索結果DTO
 */
@Serializable
data class SpecialEventSearchResultDto(
    override val items: List<SpecialEventDto>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int
) : PaginatedResult<SpecialEventDto> {
    companion object {
        fun of(items: List<SpecialEventDto>, totalCount: Int, pageRequest: PageRequest): SpecialEventSearchResultDto {
            return SpecialEventSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size
            )
        }
    }
}