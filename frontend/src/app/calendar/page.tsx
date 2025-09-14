import { Metadata } from 'next'
import CalendarView from '@/features/calendar/components/CalendarView'

export const metadata: Metadata = {
  title: 'カレンダー - だんいんポータル',
  description: '白銀ノエル関連のイベント・グッズスケジュールを確認できます',
}

export default function CalendarPage() {
  return <CalendarView />
}