package com.shirogane.holy.knights.application.dto

import com.shirogane.holy.knights.domain.model.Channel
import kotlinx.serialization.Serializable

/**
 * チャンネルDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class ChannelDto(
    val id: String,
    val title: String,
    val handle: String? = null,
    val description: String? = null,
    val subscriberCount: Int? = null,
    val iconUrl: String? = null
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(channel: Channel): ChannelDto {
            return ChannelDto(
                id = channel.id.value,
                title = channel.title,
                handle = channel.channelDetails?.handle,
                description = channel.channelDetails?.description,
                subscriberCount = channel.channelDetails?.subscriberCount,
                iconUrl = channel.channelDetails?.iconUrl
            )
        }
    }
}
