package com.shirogane.holy.knights.domain.model

import java.time.Instant

/**
 * チャンネルドメインモデル
 */
data class Channel(
    val id: ChannelId,
    val title: String,
    val channelDetails: ChannelDetails? = null
)

/**
 * チャンネル詳細情報値オブジェクト
 */
data class ChannelDetails(
    val handle: String? = null,
    val description: String? = null,
    val subscriberCount: Int? = null,
    val iconUrl: String? = null
)
