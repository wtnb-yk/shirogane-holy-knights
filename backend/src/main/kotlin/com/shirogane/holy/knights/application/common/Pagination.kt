package com.shirogane.holy.knights.application.common

import kotlinx.serialization.Serializable

/**
 * ページングリクエスト情報（APIは1ベース、内部は0ベース）
 */
data class PageRequest(
    val requestPage: Int = 1,  // APIから受け取る1ベースのページ番号
    val size: Int = 20
) {
    // 内部的に使用する0ベースのページ番号
    val page: Int
        get() = requestPage - 1
    
    init {
        require(requestPage >= 1) { "Page must be 1 or greater, but was: $requestPage" }
        require(size > 0) { "Size must be greater than 0, but was: $size" }
        require(size <= 100) { "Size must be 100 or less, but was: $size" }
    }

    /**
     * データベース用のオフセット値を計算
     */
    val offset: Int
        get() = page * size
}

/**
 * ページング済みのレスポンス情報（内部は0ベース、APIレスポンスは1ベース）
 */
@Serializable
data class PageResponse<T>(
    val content: List<T>,
    val totalElements: Int,
    private val internalPage: Int,  // 内部的な0ベースのページ番号
    val size: Int
) {
    // APIレスポンス用の1ベースのページ番号
    val page: Int
        get() = internalPage + 1
    
    /**
     * 総ページ数を計算
     * 0件の場合は0ページ、それ以外は切り上げ
     */
    val totalPages: Int
        get() = if (totalElements == 0) 0 else ((totalElements + size - 1) / size)

    /**
     * 次のページが存在するかどうか（1ベース）
     */
    val hasMore: Boolean
        get() = page < totalPages

    companion object {
        /**
         * PageRequestとデータからPageResponseを生成
         */
        fun <T> of(content: List<T>, totalElements: Int, pageRequest: PageRequest): PageResponse<T> {
            return PageResponse(
                content = content,
                totalElements = totalElements,
                internalPage = pageRequest.page,  // 0ベースの内部ページ番号を保存
                size = pageRequest.size
            )
        }
    }
}
