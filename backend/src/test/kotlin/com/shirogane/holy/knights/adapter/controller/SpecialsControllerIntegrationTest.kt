package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.dto.SpecialEventDto
import com.shirogane.holy.knights.adapter.controller.dto.SpecialEventSearchResultDto
import com.shirogane.holy.knights.adapter.gateway.SpecialEventRepositoryImpl
import com.shirogane.holy.knights.application.usecase.SpecialsUseCaseImpl
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class SpecialsControllerIntegrationTest {

    private val repository = SpecialEventRepositoryImpl()
    private val useCase = SpecialsUseCaseImpl(repository)
    private val objectMapper = ObjectMapper()
    private val controller = SpecialsController(useCase, objectMapper)

    @Test
    fun `getSpecialEvents should return mock data successfully`() = runBlocking {
        // When
        val response = controller.getSpecialEvents()

        // Then
        assertEquals(200, response.statusCode)
        assertTrue(response.body is SpecialEventSearchResultDto)
        
        val result = response.body as SpecialEventSearchResultDto
        assertEquals(3, result.totalCount)
        assertEquals(3, result.items.size)
        
        // Verify first event (sorted by startDate ascending)
        val firstEvent = result.items[0]
        assertEquals("3", firstEvent.id)
        assertEquals("Summer Festival 2024", firstEvent.title)
        assertEquals("ended", firstEvent.status)
    }

    @Test
    fun `getSpecialEventDetails should return specific event when valid id provided`() = runBlocking {
        // Given
        val eventId = "1"

        // When
        val response = controller.getSpecialEventDetails(eventId)

        // Then
        assertEquals(200, response.statusCode)
        assertTrue(response.body is SpecialEventDto)
        
        val event = response.body as SpecialEventDto
        assertEquals("1", event.id)
        assertEquals("Birthday Celebration 2024", event.title)
        assertEquals("upcoming", event.status)
    }

    @Test
    fun `getSpecialEventDetails should return error when invalid id provided`() = runBlocking {
        // Given
        val eventId = "999"

        // When
        val response = controller.getSpecialEventDetails(eventId)

        // Then
        assertEquals(400, response.statusCode)
    }

    @Test
    fun `getSpecialEventDetails should handle empty id`() = runBlocking {
        // Given
        val eventId = ""

        // When
        val response = controller.getSpecialEventDetails(eventId)

        // Then
        assertEquals(400, response.statusCode)
    }
}
