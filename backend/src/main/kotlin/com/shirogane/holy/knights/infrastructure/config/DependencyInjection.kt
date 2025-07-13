package com.shirogane.holy.knights.infrastructure.config

import com.shirogane.holy.knights.adapter.`in`.controller.ArchiveController
import com.shirogane.holy.knights.adapter.out.persistence.ArchiveRepositoryImpl
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import com.shirogane.holy.knights.application.usecase.ArchiveUseCaseImpl
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import com.shirogane.holy.knights.domain.service.ArchiveDomainService

/**
 * 依存関係の注入を管理するオブジェクト
 * 単純な手動DIを実現するシングルトンオブジェクト
 * 依存関係のグラフを構築し、必要に応じてコンポーネントを提供する
 */
object DependencyInjection {
    // レイヤードアーキテクチャに沿った依存関係の管理
    
    // 永続化層（リポジトリ実装）
    private val archiveRepository: ArchiveRepository by lazy { 
        ArchiveRepositoryImpl() 
    }
    
    // ドメイン層（サービス）
    private val archiveDomainService: ArchiveDomainService by lazy { 
        ArchiveDomainService(archiveRepository) 
    }
    
    // アプリケーション層（ユースケース）
    private val archiveUseCase: ArchiveUseCasePort by lazy {
        ArchiveUseCaseImpl(archiveRepository, archiveDomainService)
    }
    
    // プレゼンテーション層（コントローラー）
    val archiveController: ArchiveController by lazy {
        ArchiveController(archiveUseCase)
    }
    
    /**
     * 依存関係の初期化
     * アプリケーション起動時に呼び出される
     */
    fun init() {
        // 遅延初期化された依存関係を事前にロードするために、
        // 各インスタンスにアクセスして初期化を強制する
        archiveRepository
        archiveDomainService
        archiveUseCase
        archiveController
    }
}