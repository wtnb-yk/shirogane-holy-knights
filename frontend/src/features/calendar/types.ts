export interface EventType {
  id: number
  type: string
}

export interface Event {
  id: number
  title: string
  description?: string
  eventDate: string // YYYY-MM-DD
  eventTime?: string // HH:MM:SS
  endDate?: string
  endTime?: string
  url?: string
  imageUrl?: string
  eventTypes: EventType[]
  createdAt: string
}

export type CalendarView = 'month' | 'week' | 'day'

export interface CalendarState {
  currentView: CalendarView
  currentDate: Date
  selectedEventTypes: number[]
  searchQuery: string
  selectedEvent: Event | null
  isEventModalOpen: boolean
}