import { Event } from '../types';

export interface EventSegment {
  event: Event;
  startDayIndex: number; // 0-6 (Sunday-Saturday)
  endDayIndex: number;   // 0-6
  laneIndex: number;     // レーン番号 (0-2)
}

export interface WeekEventLayout {
  eventBands: EventSegment[];
  singleDayEvents: { [dayIndex: number]: Event[] };
  maxLanes: number;
}

const MAX_LANES = 3;

export function calculateWeekEventLayout(
  weekStartDate: Date,
  weekEndDate: Date,
  events: Event[]
): WeekEventLayout {
  const multiDayEvents: Event[] = [];
  const singleDayEventsByDay: { [dayIndex: number]: Event[] } = {};

  // 単日・複数日イベントを分類
  for (const event of events) {
    if (event.endDate && event.endDate !== event.eventDate) {
      if (eventIntersectsWeek(event, weekStartDate, weekEndDate)) {
        multiDayEvents.push(event);
      }
    } else {
      const eventDate = new Date(event.eventDate + 'T00:00:00');
      if (eventDate >= weekStartDate && eventDate <= weekEndDate) {
        const dayIndex = getDayIndexInWeek(eventDate, weekStartDate);
        if (!singleDayEventsByDay[dayIndex]) {
          singleDayEventsByDay[dayIndex] = [];
        }
        singleDayEventsByDay[dayIndex].push(event);
      }
    }
  }

  // 複数日イベントをレーンに配置
  const eventBands = assignEventLanes(multiDayEvents, weekStartDate, weekEndDate);
  const maxLanes = Math.min(eventBands.length > 0 ? Math.max(...eventBands.map(b => b.laneIndex)) + 1 : 0, MAX_LANES);

  // 表示制限を超えた場合の処理
  const visibleBands = eventBands.filter(band => band.laneIndex < MAX_LANES);
  const hiddenCount = eventBands.length - visibleBands.length;

  // 隠れたイベントがある場合は情報を付加（実装時に活用）
  if (hiddenCount > 0) {
    // TODO: +N件表示の処理
  }

  return {
    eventBands: visibleBands,
    singleDayEvents: singleDayEventsByDay,
    maxLanes
  };
}

function eventIntersectsWeek(event: Event, weekStart: Date, weekEnd: Date): boolean {
  const eventStart = new Date(event.eventDate + 'T00:00:00');
  const eventEnd = new Date((event.endDate || event.eventDate) + 'T23:59:59');

  return eventStart <= weekEnd && eventEnd >= weekStart;
}

function getDayIndexInWeek(date: Date, weekStartDate: Date): number {
  const diffTime = date.getTime() - weekStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(6, diffDays));
}

function assignEventLanes(
  events: Event[],
  weekStartDate: Date,
  weekEndDate: Date
): EventSegment[] {
  const segments: EventSegment[] = [];
  const lanes: EventSegment[][] = [];

  for (const event of events) {
    const eventStart = new Date(event.eventDate + 'T00:00:00');
    const eventEnd = new Date((event.endDate || event.eventDate) + 'T00:00:00');

    // 週の範囲内でクリップ
    const clippedStart = eventStart > weekStartDate ? eventStart : weekStartDate;
    const clippedEnd = eventEnd < weekEndDate ? eventEnd : weekEndDate;

    const startDayIndex = getDayIndexInWeek(clippedStart, weekStartDate);
    const endDayIndex = getDayIndexInWeek(clippedEnd, weekStartDate);

    // 利用可能なレーンを探す
    let assignedLane = -1;
    for (let laneIndex = 0; laneIndex < MAX_LANES; laneIndex++) {
      if (!lanes[laneIndex]) {
        lanes[laneIndex] = [];
      }

      const hasConflict = lanes[laneIndex].some(existingSegment =>
        segmentsOverlap(
          { startDayIndex, endDayIndex },
          {
            startDayIndex: existingSegment.startDayIndex,
            endDayIndex: existingSegment.endDayIndex
          }
        )
      );

      if (!hasConflict) {
        assignedLane = laneIndex;
        break;
      }
    }

    if (assignedLane !== -1) {
      const segment: EventSegment = {
        event,
        startDayIndex,
        endDayIndex,
        laneIndex: assignedLane
      };

      segments.push(segment);
      lanes[assignedLane].push(segment);
    }
  }

  return segments;
}

function segmentsOverlap(
  a: { startDayIndex: number; endDayIndex: number },
  b: { startDayIndex: number; endDayIndex: number }
): boolean {
  return a.startDayIndex <= b.endDayIndex && b.startDayIndex <= a.endDayIndex;
}