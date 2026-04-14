package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.application.common.PaginatedResult
import com.shirogane.holy.knights.domain.model.Event
import com.shirogane.holy.knights.domain.model.EventType
import kotlinx.serialization.Serializable
import java.time.LocalDate

/**
 * イベントDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class EventDto(
    val id: String,
    val title: String,
    val description: String? = null,
    val eventDate: String, // YYYY-MM-DD形式
    val eventTime: String? = null, // HH:MM:SS形式
    val endDate: String? = null,
    val endTime: String? = null,
    val url: String? = null,
    val imageUrl: String? = null,
    val eventTypes: List<EventTypeDto>,
    val createdAt: String // ISO 8601形式
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(event: Event): EventDto {
            return EventDto(
                id = event.id.value,
                title = event.title,
                description = event.description,
                eventDate = event.eventDate.toString(), // YYYY-MM-DD
                eventTime = event.eventTime?.toString(), // HH:MM:SS
                endDate = event.endDate?.toString(),
                endTime = event.endTime?.toString(),
                url = event.url,
                imageUrl = event.imageUrl,
                eventTypes = event.eventTypes.map { EventTypeDto.fromDomain(it) },
                createdAt = event.createdAt.toString() // ISO 8601
            )
        }
    }
}

/**
 * イベントタイプDTO
 */
@Serializable
data class EventTypeDto(
    val id: Int,
    val type: String
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(eventType: EventType): EventTypeDto {
            return EventTypeDto(
                id = eventType.id,
                type = eventType.type
            )
        }
    }
}

/**
 * イベント検索パラメータDTO
 */
data class EventSearchParamsDto(
    val eventTypeIds: List<Int>? = null,
    val startDate: String? = null, // YYYY-MM-DD形式
    val endDate: String? = null,   // YYYY-MM-DD形式
    val page: Int = 1,
    val pageSize: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = PageRequest(page, pageSize)

    /**
     * 開始日をLocalDateに変換
     */
    fun getStartDateAsLocalDate(): LocalDate? {
        return startDate?.let { LocalDate.parse(it) }
    }

    /**
     * 終了日をLocalDateに変換
     */
    fun getEndDateAsLocalDate(): LocalDate? {
        return endDate?.let { LocalDate.parse(it) }
    }
}

/**
 * イベント検索結果DTO
 */
@Serializable
data class EventSearchResultDto(
    override val items: List<EventDto>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int
) : PaginatedResult<EventDto> {
    companion object {
        fun of(items: List<EventDto>, totalCount: Int, pageRequest: PageRequest): EventSearchResultDto {
            return EventSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size
            )
        }
    }
}