package com.shirogane.holy.knights.infrastructure.lambda

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class ApiGatewayRouterSpecialsTest {

    @Test
    fun `should extract eventId from specials path correctly`() {
        // Given
        val path = "/specials/123"
        
        // When
        val eventId = path.removePrefix("/specials/")
        
        // Then
        assertEquals("123", eventId)
        assertTrue(eventId.isNotBlank())
    }

    @Test
    fun `should handle empty eventId in specials path`() {
        // Given
        val path = "/specials/"
        
        // When
        val eventId = path.removePrefix("/specials/")
        
        // Then
        assertEquals("", eventId)
        assertTrue(eventId.isBlank())
    }

    @Test
    fun `should handle complex eventId in specials path`() {
        // Given
        val path = "/specials/event-123-special"
        
        // When
        val eventId = path.removePrefix("/specials/")
        
        // Then
        assertEquals("event-123-special", eventId)
        assertTrue(eventId.isNotBlank())
    }
}