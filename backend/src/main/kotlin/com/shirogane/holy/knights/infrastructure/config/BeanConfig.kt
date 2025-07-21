package com.shirogane.holy.knights.infrastructure.config

import com.shirogane.holy.knights.adapter.gateway.ArchiveRepositoryImpl
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import com.shirogane.holy.knights.application.usecase.ArchiveUseCaseImpl
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import com.shirogane.holy.knights.domain.service.ArchiveDomainService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.core.JdbcTemplate

/**
 * Bean設定クラス
 * Spring依存性注入のためのBean定義
 */
@Configuration
class BeanConfig {
    
    /**
     * アーカイブリポジトリ
     */
    @Bean
    fun archiveRepository(jdbcTemplate: JdbcTemplate): ArchiveRepository {
        return ArchiveRepositoryImpl(jdbcTemplate)
    }
    
    /**
     * アーカイブドメインサービス
     */
    @Bean
    fun archiveDomainService(archiveRepository: ArchiveRepository): ArchiveDomainService {
        return ArchiveDomainService(archiveRepository)
    }
    
    /**
     * アーカイブユースケース
     */
    @Bean
    fun archiveUseCase(
        archiveRepository: ArchiveRepository,
        archiveDomainService: ArchiveDomainService,
        coroutineScope: kotlinx.coroutines.CoroutineScope
    ): ArchiveUseCasePort {
        return ArchiveUseCaseImpl(archiveRepository, archiveDomainService, coroutineScope)
    }
}