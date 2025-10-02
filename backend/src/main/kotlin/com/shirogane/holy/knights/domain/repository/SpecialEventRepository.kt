package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.SpecialEvent
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.model.SpecialEvents

/**
 * スペシャルイベントリポジトリインターフェース
 * ドメイン層で定義するアウトバウンドポート
 */
interface SpecialEventRepository {
    /**
     * 全スペシャルイベントを取得
     */
    suspend fun findAll(
        limit: Int,
        offset: Int
    ): SpecialEvents

    /**
     * スペシャルイベント総件数を取得
     */
    suspend fun count(): Int

    /**
     * IDでスペシャルイベント詳細を取得
     */
    suspend fun findById(eventId: SpecialEventId): SpecialEvent?
}