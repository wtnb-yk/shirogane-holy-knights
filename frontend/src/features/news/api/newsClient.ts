import { 
  NewsSearchParamsDto, 
  NewsListParamsDto, 
  NewsDetailParamsDto,
  NewsSearchResultDto, 
  NewsDto,
  NewsApiError 
} from '../types/types';

/**
 * News API のエンドポイント設定
 */
const API_CONFIG = {
  // 環境変数から取得するか、デフォルトとしてlocalhostを使用
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
};

/**
 * ニュースAPIクライアント
 * Spring Boot APIを呼び出すためのクライアント
 */
export class NewsClient {

  /**
   * ニュース検索APIを呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async searchNews(
    params: NewsSearchParamsDto
  ): Promise<NewsSearchResultDto> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/newsSearch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
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

  /**
   * ニュース一覧APIを呼び出す
   * @param params 一覧パラメータ
   * @returns 一覧結果
   */
  static async getNewsList(
    params: NewsListParamsDto
  ): Promise<NewsSearchResultDto> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/newsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
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

  /**
   * ニュース詳細APIを呼び出す
   * @param params 詳細パラメータ
   * @returns ニュース詳細
   */
  static async getNewsDetail(
    params: NewsDetailParamsDto
  ): Promise<NewsDto> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/newsDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          error: errorData.error || 'ニュース詳細の取得に失敗しました。',
          statusCode: response.status,
        } as NewsApiError;
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
}