package com.shirogane.holy.knights.domain.repository

import com.shirogane.holy.knights.domain.model.Messages
import com.shirogane.holy.knights.domain.model.SpecialEventId

/**
 * メッセージリポジトリインターフェース
 */
interface MessageRepository {
    /**
     * 特定のスペシャルイベントに関連するメッセージを取得
     */
    suspend fun findBySpecialEventId(specialEventId: SpecialEventId): Messages
}
