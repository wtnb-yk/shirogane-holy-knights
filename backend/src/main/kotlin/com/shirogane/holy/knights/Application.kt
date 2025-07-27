package com.shirogane.holy.knights

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.WebApplicationType

@SpringBootApplication
class Application {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            val app = org.springframework.boot.SpringApplication(Application::class.java)
            app.webApplicationType = WebApplicationType.REACTIVE
            app.run(*args)
        }
    }
}
