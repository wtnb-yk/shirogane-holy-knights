package com.shirogane.holy.knights.domain

import com.shirogane.holy.knights.util.NullableUtil.isNull

interface DomainError {
    val message: String
}

interface ValueObjectError : DomainError {
    val property: String
    val input: String
    override val message: String
        get() = "Invalid $property value. input: $input"
}

abstract class RepositoryError(open val cause: Throwable?) : DomainError {
    val hasCause by lazy { this.cause.isNull() }
}
