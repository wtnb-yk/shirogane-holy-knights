import { Event, EventType } from '../types'

export const eventTypes: EventType[] = [
  { id: 1, type: 'event' },
  { id: 2, type: 'goods' },
  { id: 3, type: 'campaign' }
]

export const mockEvents: Event[] = [
  {
    id: 1,
    title: '3Dライブ 2024',
    description: '白銀ノエルの3Dライブイベント\n詳細な説明がここに入ります。チケット販売開始は12月1日からです。',
    eventDate: '2025-09-10',
    eventTime: '20:00:00',
    endDate: '2025-09-15',
    endTime: '20:00:00',
    url: 'https://example.com/tickets',
    eventTypes: [{ id: 1, type: 'event' }],
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'ホロライブ年末ライブ',
    description: 'ホロライブ年末恒例のライブイベント。白銀ノエルも参加予定です。',
    eventDate: '2024-12-31',
    eventTime: '19:00:00',
    eventTypes: [{ id: 1, type: 'event' }],
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 3,
    title: '新春記念グッズ',
    description: '新春記念の限定グッズが発売されます。数量限定のため、お早めにご購入ください。',
    eventDate: '2025-09-12',
    eventTime: '00:00:00',
    url: 'https://example.com/goods',
    eventTypes: [{ id: 2, type: 'goods' }],
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 4,
    title: 'バレンタイングッズ',
    description: 'バレンタイン限定のチョコレートとアクスタのセット',
    eventDate: '2025-09-04',
    eventTypes: [{ id: 2, type: 'goods' }],
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 5,
    title: 'ホワイトデーお返し配信',
    description: 'ホワイトデーの感謝を込めたお返し配信を予定しています',
    eventDate: '2025-03-14',
    eventTime: '20:00:00',
    eventTypes: [{ id: 1, type: 'event' }],
    createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 6,
    title: '春の新グッズ',
    description: '春をテーマにした新作グッズが登場。桜をモチーフにしたデザインが特徴です。',
    eventDate: '2025-03-20',
    eventTime: '12:00:00',
    url: 'https://example.com/spring-goods',
    eventTypes: [{ id: 2, type: 'goods' }],
    createdAt: '2025-02-15T10:00:00Z'
  },
  {
    id: 7,
    title: '歌枠スペシャル',
    description: '月末恒例の歌枠スペシャル配信。リクエスト曲も歌います！',
    eventDate: '2025-01-31',
    eventTime: '21:00:00',
    eventTypes: [{ id: 1, type: 'event' }],
    createdAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 8,
    title: '誕生日記念配信',
    description: '白銀ノエルの誕生日を記念した特別配信です',
    eventDate: '2024-11-25',
    eventTime: '20:00:00',
    eventTypes: [{ id: 1, type: 'event' }],
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 9,
    title: 'ファンアートコンテスト',
    description: 'ファンアートコンテスト開催！優秀作品には特別なプレゼントがあります',
    eventDate: '2025-09-01',
    endDate: '2025-02-28',
    url: 'https://example.com/fanart-contest',
    eventTypes: [{ id: 3, type: 'campaign' }],
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 10,
    title: '新規メンバーシップ特典キャンペーン',
    description: '期間限定で新規メンバーシップ加入者に特別な特典をプレゼント',
    eventDate: '2025-01-15',
    endDate: '2025-01-31',
    eventTypes: [{ id: 3, type: 'campaign' }],
    createdAt: '2025-01-10T10:00:00Z'
  }
]
