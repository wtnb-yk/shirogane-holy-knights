package com.shirogane.holy.knights.adapter.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

/**
 * ヘルスチェック用コントローラー
 */
@RestController
class HealthController {

    @GetMapping("/health")
    fun health(): Mono<ResponseEntity<Map<String, String>>> {
        return Mono.just(ResponseEntity.ok(mapOf(
            "status" to "healthy",
            "service" to "shirogane-holy-knights-api"
        )))
    }
}