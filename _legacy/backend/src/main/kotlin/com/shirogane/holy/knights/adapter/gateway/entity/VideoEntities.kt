package com.shirogane.holy.knights.adapter.gateway.entity

import java.time.Instant

@org.springframework.data.relational.core.mapping.Table("videos")
data class VideoEntity(
    @org.springframework.data.annotation.Id
    val id: String,
    val title: String,
    val description: String?,
    val url: String?,
    val thumbnailUrl: String?,
    val duration: String?,
    val channelId: String,
    val publishedAt: Instant?,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("stream_details")
data class StreamDetailsEntity(
    @org.springframework.data.annotation.Id
    val videoId: String,
    val startedAt: Instant?,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("video_video_tags")
data class VideoTagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val videoId: String,
    val tagId: Long
)

@org.springframework.data.relational.core.mapping.Table("video_tags")
data class TagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val name: String,
    val description: String?,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("video_types")
data class VideoTypeEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val type: String
)

@org.springframework.data.relational.core.mapping.Table("video_video_types")
data class VideoVideoTypeEntity(
    val videoId: String,
    val videoTypeId: Int,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("stream_tags")
data class StreamTagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val name: String,
    val description: String?,
    val createdAt: Instant?
)

@org.springframework.data.relational.core.mapping.Table("video_stream_tags")
data class VideoStreamTagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val videoId: String,
    val tagId: Long
)