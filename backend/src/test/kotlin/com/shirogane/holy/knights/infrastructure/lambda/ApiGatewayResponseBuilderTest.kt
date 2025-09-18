package com.shirogane.holy.knights.infrastructure.lambda

import com.fasterxml.jackson.databind.ObjectMapper
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldContain

class ApiGatewayResponseBuilderTest : DescribeSpec({
    
    val objectMapper = ObjectMapper()
    val responseBuilder = ApiGatewayResponseBuilder(objectMapper)
    
    describe("ApiGatewayResponseBuilder") {
        
        describe("success with cache") {
            
            it("should include cache headers for cacheable responses") {
                val testData = mapOf("message" to "test")
                val response = responseBuilder.successWithLongCache(testData, 3600)
                
                response.statusCode shouldBe 200
                response.headers shouldNotBe null
                response.headers!!["Cache-Control"] shouldContain "max-age=3600"
                response.headers!!["Expires"] shouldNotBe null
                response.headers!!["ETag"] shouldNotBe null
            }
            
            it("should include security headers") {
                val testData = mapOf("message" to "test")
                val response = responseBuilder.success(testData)
                
                response.headers!!["X-Content-Type-Options"] shouldBe "nosniff"
                response.headers!!["X-Frame-Options"] shouldBe "DENY"
                response.headers!!["Vary"] shouldBe "Accept-Encoding"
            }
        }
        
        describe("successNoCache") {
            
            it("should include no-cache headers") {
                val testData = mapOf("message" to "test")
                val response = responseBuilder.successNoCache(testData)
                
                response.statusCode shouldBe 200
                response.headers!!["Cache-Control"] shouldBe "no-cache, no-store, must-revalidate"
                response.headers!!["Pragma"] shouldBe "no-cache"
                response.headers!!["Expires"] shouldBe "0"
            }
        }
        
        describe("compression") {
            
            it("should not compress small responses") {
                val smallData = mapOf("msg" to "hi")
                val response = responseBuilder.success(smallData)
                
                response.isBase64Encoded shouldBe false
                response.headers?.get("Content-Encoding") shouldBe null
            }
            
            it("should compress large responses") {
                // Create a large response (over 1KB)
                val largeData = mapOf(
                    "data" to (1..100).map { "This is a long string to make the response large enough for compression testing. Item $it" }
                )
                val response = responseBuilder.success(largeData)
                
                // Check if compression was applied
                val hasCompression = response.isBase64Encoded == true && 
                                   response.headers?.get("Content-Encoding") == "gzip"
                
                // Compression should be applied for large responses
                if (response.body!!.length > 1024) {
                    hasCompression shouldBe true
                }
            }
        }
        
        describe("error responses") {
            
            it("should include timestamp in error responses") {
                val response = responseBuilder.badRequest("Test error")
                
                response.statusCode shouldBe 400
                response.body shouldContain "timestamp"
                response.body shouldContain "Test error"
            }
            
            it("should include security headers in error responses") {
                val response = responseBuilder.error(500, "Server error")
                
                response.headers!!["X-Content-Type-Options"] shouldBe "nosniff"
                response.headers!!["X-Frame-Options"] shouldBe "DENY"
                response.headers!!["Cache-Control"] shouldContain "no-cache"
            }
        }
    }
})