package com.shirogane.holy.knights.application.common

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

    val offset: Int
        get() = page * size
}