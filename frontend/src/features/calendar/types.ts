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

export interface CalendarState {
  currentDate: Date
  selectedEventTypes: number[]
  searchQuery: string
  selectedEvent: Event | null
  isEventModalOpen: boolean
}

// API用のDTO型
export interface EventDto {
  id: number
  title: string
  description?: string
  eventDate: string // YYYY-MM-DD
  eventTime?: string // HH:MM:SS
  endDate?: string
  endTime?: string
  url?: string
  imageUrl?: string
  eventTypes: EventTypeDto[]
  createdAt: string
}

export interface EventTypeDto {
  id: number
  type: string
}

export interface CalendarSearchParamsDto {
  query?: string
  eventTypeIds?: number[]
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
  page?: number
  pageSize?: number
}

export interface CalendarSearchResultDto {
  items: EventDto[]
  totalCount: number
  hasMore: boolean
}

export interface CalendarApiError {
  error: string
  statusCode: number
}

export interface CalendarFilterOptions {
  eventTypeIds?: number[]
  startDate?: string
  endDate?: string
}
