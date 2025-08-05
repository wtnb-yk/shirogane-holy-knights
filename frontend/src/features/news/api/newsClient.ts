import { 
  NewsSearchParamsDto, 
  NewsSearchResultDto, 
  NewsDto,
  NewsApiError 
} from '../types/types';

/**
 * News API のエンドポイント設定
 */
const API_CONFIG = {
  // 環境変数から取得するか、デフォルトとしてlocalhostを使用
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
};

/**
 * ニュースAPIクライアント
 * Spring Boot APIを呼び出すためのクライアント
 */
export class NewsClient {

  /**
   * ニュース検索APIを呼び出す (統合版：一覧取得と検索機能を統合)
   * Video実装パターンに合わせて統合
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async searchNews(
    params: NewsSearchParamsDto = {}
  ): Promise<NewsSearchResultDto> {
    try {
      // デフォルト値を設定（Video実装パターンに合わせて）
      const requestParams = {
        query: params.query,
        categoryId: params.categoryId,
        startDate: params.startDate,
        endDate: params.endDate,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      };

      const response = await fetch(`${API_CONFIG.baseUrl}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestParams),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          error: errorData.error || 'ニュースの取得に失敗しました。',
          statusCode: response.status,
        } as NewsApiError;
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

}
