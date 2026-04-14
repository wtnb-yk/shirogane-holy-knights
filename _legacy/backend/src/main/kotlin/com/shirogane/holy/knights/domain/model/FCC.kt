package com.shirogane.holy.knights.domain.model

@Suppress("DELEGATED_MEMBER_HIDES_SUPERTYPE_OVERRIDE")
abstract class FCC<T>(private val list: List<T>) : List<T> by list {
    interface FCCFactory<T, out L : FCC<T>> {
        fun of(list: List<T>): L
        fun of(vararg array: T) = of(array.toList())
    }
}

fun <T, L : FCC<T>> List<T>.toFCC(factory: FCC.FCCFactory<T, L>) = factory.of(this)
