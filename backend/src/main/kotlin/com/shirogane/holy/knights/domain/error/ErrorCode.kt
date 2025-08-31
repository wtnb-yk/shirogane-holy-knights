package com.shirogane.holy.knights.domain.error

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val category: ErrorCodeCategory,
    val httpStatus: HttpStatus,
    val message: String
) {
    NOT_FOUND(
        category = ErrorCodeCategory.ClientError,
        httpStatus = HttpStatus.NOT_FOUND,
        message = "リソースが見つかりません"
    ),
    BAD_REQUEST(
        category = ErrorCodeCategory.ClientError,
        httpStatus = HttpStatus.BAD_REQUEST,
        message = "リクエストが不正です"
    ),
    INTERNAL_SERVER_ERROR(
        category = ErrorCodeCategory.ServerError,
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        message = "サーバー内部エラーが発生しました"
    );
    
    val code: String get() = this.name
}