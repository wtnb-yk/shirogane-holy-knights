package com.shirogane.holy.knights.util

object NullableUtil {

    fun <A> A?.isNull(): Boolean = this === null

    fun <A> A?.isNotNull(): Boolean = !this.isNull()

}
