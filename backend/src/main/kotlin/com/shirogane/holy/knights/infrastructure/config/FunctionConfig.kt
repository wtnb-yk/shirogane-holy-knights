package com.shirogane.holy.knights.infrastructure.config

import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto
import com.shirogane.holy.knights.infrastructure.lambda.functions.ArchiveSearchFunction
import com.shirogane.holy.knights.infrastructure.lambda.functions.ArchiveSearchRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.function.Function

/**
 * Spring Cloud Function関数定義
 * 
 * 明示的に関数Beanを定義することで、正しくエンドポイントが公開されるようにします。
 */
@Configuration
class FunctionConfig {
    
    /**
     * アーカイブ検索関数を明示的に登録
     */
    @Bean
    fun archiveSearch(archiveSearchFunction: ArchiveSearchFunction): Function<ArchiveSearchRequest, ArchiveSearchResultDto> {
        return archiveSearchFunction
    }
}