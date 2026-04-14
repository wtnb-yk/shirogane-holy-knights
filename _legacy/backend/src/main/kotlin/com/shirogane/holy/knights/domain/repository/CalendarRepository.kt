package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Events
import com.shirogane.holy.knights.domain.model.EventType
import java.time.LocalDate

/**
 * カレンダーリポジトリインターフェース
 * ドメイン層で定義するアウトバウンドポート
 */
interface CalendarRepository {
    /**
     * イベント検索
     */
    suspend fun search(
        eventTypeIds: List<Int>? = null,
        startDate: LocalDate? = null,
        endDate: LocalDate? = null,
        limit: Int,
        offset: Int
    ): Events

    /**
     * イベント検索結果総件数を取得
     */
    suspend fun countBySearchCriteria(
        eventTypeIds: List<Int>? = null,
        startDate: LocalDate? = null,
        endDate: LocalDate? = null
    ): Int

    /**
     * 全イベントタイプを取得
     */
    suspend fun findAllEventTypes(): List<EventType>
}