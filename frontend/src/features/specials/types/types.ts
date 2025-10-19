/**
 * スペシャルイベントDTOの型定義
 */
export interface SpecialEventDto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  eventTypes: string[];
}

/**
 * メッセージDTOの型定義
 */
export interface MessageDto {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

/**
 * スペシャルイベント詳細DTOの型定義
 */
export interface SpecialEventDetailDto {
  event: SpecialEventDto;
  messages: MessageDto[];
}

/**
 * スペシャルイベント検索結果の型定義
 */
export interface SpecialEventSearchResultDto {
  items: SpecialEventDto[];
  totalCount: number;
}