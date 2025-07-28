package com.shirogane.holy.knights.adapter.gateway

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import java.time.Instant

class ArchiveRepositoryImpl(
    private val template: R2dbcEntityTemplate
) : ArchiveRepository {

    private val logger = LoggerFactory.getLogger(ArchiveRepositoryImpl::class.java)

    override fun findAll(limit: Int, offset: Int): List<Archive> {
        logger.info("アーカイブ一覧取得: limit=$limit, offset=$offset")
        return runBlocking {
            try {
                val archives = template.select(ArchiveEntity::class.java)
                    .matching(Query.empty().offset(offset.toLong()).limit(limit))
                    .all()
                    .collectList()
                    .awaitSingle()
                
                archives.map { runBlocking { buildArchive(it) } }
            } catch (e: Exception) {
                logger.error("アーカイブ一覧取得エラー", e)
                emptyList()
            }
        }
    }

    override fun count(): Int {
        logger.info("アーカイブ総数取得")
        return runBlocking {
            try {
                template.count(Query.empty(), ArchiveEntity::class.java)
                    .awaitSingle()
                    .toInt()
            } catch (e: Exception) {
                logger.error("アーカイブ総数取得エラー", e)
                0
            }
        }
    }

    override fun findById(id: ArchiveId): Archive? {
        logger.info("アーカイブ取得: id=$id")
        return runBlocking {
            try {
                val archive = template.select(ArchiveEntity::class.java)
                    .matching(Query.query(Criteria.where("id").`is`(id.value)))
                    .one()
                    .awaitSingleOrNull()
                
                archive?.let { buildArchive(it) }
            } catch (e: Exception) {
                logger.error("アーカイブ取得エラー: id=$id", e)
                null
            }
        }
    }

    override fun search(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?,
        limit: Int,
        offset: Int
    ): List<Archive> {
        logger.info("アーカイブ検索: query=$query, tags=$tags")
        return runBlocking {
            try {
                var criteria = Criteria.empty()
                
                // タイトル・説明での部分一致検索
                query?.let {
                    criteria = criteria.and(
                        Criteria.where("title").like("%$it%")
                            .or(Criteria.where("description").like("%$it%"))
                    )
                }
                
                // 日付範囲検索
                startDate?.let {
                    criteria = criteria.and(Criteria.where("published_at").greaterThanOrEquals(it))
                }
                endDate?.let {
                    criteria = criteria.and(Criteria.where("published_at").lessThanOrEquals(it))
                }
                
                // タグ検索（簡易実装）
                tags?.takeIf { it.isNotEmpty() }?.let {
                    val tagCriteria = it.map { tag ->
                        Criteria.where("tags").like("%$tag%")
                    }.reduce { acc, criterion -> acc.or(criterion) }
                    criteria = criteria.and(tagCriteria)
                }
                
                val searchQuery = if (criteria == Criteria.empty()) {
                    Query.empty()
                } else {
                    Query.query(criteria)
                }.offset(offset.toLong()).limit(limit)
                
                val archives = template.select(ArchiveEntity::class.java)
                    .matching(searchQuery)
                    .all()
                    .collectList()
                    .awaitSingle()
                
                archives.map { runBlocking { buildArchive(it) } }
            } catch (e: Exception) {
                logger.error("アーカイブ検索エラー", e)
                emptyList()
            }
        }
    }

    override fun countBySearchCriteria(
        query: String?,
        tags: List<String>?,
        startDate: Instant?,
        endDate: Instant?
    ): Int {
        logger.info("検索結果総数取得")
        return runBlocking {
            try {
                var criteria = Criteria.empty()
                
                query?.let {
                    criteria = criteria.and(
                        Criteria.where("title").like("%$it%")
                            .or(Criteria.where("description").like("%$it%"))
                    )
                }
                
                startDate?.let {
                    criteria = criteria.and(Criteria.where("published_at").greaterThanOrEquals(it))
                }
                endDate?.let {
                    criteria = criteria.and(Criteria.where("published_at").lessThanOrEquals(it))
                }
                
                tags?.takeIf { it.isNotEmpty() }?.let {
                    val tagCriteria = it.map { tag ->
                        Criteria.where("tags").like("%$tag%")
                    }.reduce { acc, criterion -> acc.or(criterion) }
                    criteria = criteria.and(tagCriteria)
                }
                
                val countQuery = if (criteria == Criteria.empty()) {
                    Query.empty()
                } else {
                    Query.query(criteria)
                }
                
                template.count(countQuery, ArchiveEntity::class.java)
                    .awaitSingle()
                    .toInt()
            } catch (e: Exception) {
                logger.error("検索結果総数取得エラー", e)
                0
            }
        }
    }

    override fun getRelatedArchives(id: ArchiveId, limit: Int): List<Archive> {
        logger.info("関連アーカイブ取得: id=$id, limit=$limit")
        return runBlocking {
            try {
                // 簡易実装：同じチャンネルの最新アーカイブを取得
                val targetArchive = findById(id)
                if (targetArchive != null) {
                    template.select(ArchiveEntity::class.java)
                        .matching(
                            Query.query(
                                Criteria.where("channel_id").`is`(targetArchive.channelId.value)
                                    .and(Criteria.where("id").not(id.value))
                            ).limit(limit)
                        )
                        .all()
                        .map { runBlocking { buildArchive(it) } }
                        .collectList()
                        .awaitSingle()
                } else {
                    emptyList()
                }
            } catch (e: Exception) {
                logger.error("関連アーカイブ取得エラー: id=$id", e)
                emptyList()
            }
        }
    }

    /**
     * データベースエンティティからドメインモデルを構築するヘルパー関数
     */
    private suspend fun buildArchive(archiveEntity: ArchiveEntity): Archive {
        // 関連データを並行取得
        val videoDetailsDeferred = template.select(VideoDetailsEntity::class.java)
            .matching(Query.query(Criteria.where("archive_id").`is`(archiveEntity.id)))
            .one()
            .awaitSingleOrNull()

        val contentDetailsDeferred = template.select(ContentDetailsEntity::class.java)
            .matching(Query.query(Criteria.where("archive_id").`is`(archiveEntity.id)))
            .one()
            .awaitSingleOrNull()

        // タグ取得（archive_tags経由でjoin）
        val tagIds = template.select(ArchiveTagEntity::class.java)
            .matching(Query.query(Criteria.where("archive_id").`is`(archiveEntity.id)))
            .all()
            .collectList()
            .awaitSingle()

        val tags = if (tagIds.isNotEmpty()) {
            template.select(TagEntity::class.java)
                .matching(Query.query(Criteria.where("id").`in`(tagIds.map { it.tagId })))
                .all()
                .collectList()
                .awaitSingle()
        } else {
            emptyList()
        }

        // ドメインオブジェクトを構築
        return Archive(
            id = ArchiveId(archiveEntity.id),
            title = archiveEntity.title,
            publishedAt = archiveEntity.publishedAt,
            channelId = ChannelId(archiveEntity.channelId),
            videoDetails = videoDetailsDeferred?.let { 
                VideoDetails(
                    url = it.url,
                    duration = it.duration?.let { d -> Duration(d) },
                    thumbnailUrl = it.thumbnailUrl
                )
            },
            contentDetails = contentDetailsDeferred?.let {
                ContentDetails(
                    description = it.description,
                    isMembersOnly = it.isMembersOnly
                )
            },
            tags = tags.map { Tag(it.name) }
        )
    }
}

/**
 * データベーステーブルマッピング用エンティティ
 */
@org.springframework.data.relational.core.mapping.Table("archives")
data class ArchiveEntity(
    @org.springframework.data.annotation.Id
    val id: String,
    val title: String,
    val publishedAt: Instant,
    val channelId: String
)

@org.springframework.data.relational.core.mapping.Table("video_details")
data class VideoDetailsEntity(
    @org.springframework.data.annotation.Id
    val archiveId: String,
    val url: String,
    val duration: String?,
    val thumbnailUrl: String?
)

@org.springframework.data.relational.core.mapping.Table("content_details")
data class ContentDetailsEntity(
    @org.springframework.data.annotation.Id
    val archiveId: String,
    val description: String?,
    val isMembersOnly: Boolean = false
)

@org.springframework.data.relational.core.mapping.Table("archive_tags")
data class ArchiveTagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val archiveId: String,
    val tagId: Long
)

@org.springframework.data.relational.core.mapping.Table("tags")
data class TagEntity(
    @org.springframework.data.annotation.Id
    val id: Long? = null,
    val name: String
)