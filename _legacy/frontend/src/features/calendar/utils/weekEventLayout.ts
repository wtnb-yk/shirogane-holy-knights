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
  hiddenEventsCount: number;
  hiddenEvents: Event[];
  hiddenEventsByDay: { [dayIndex: number]: Event[] };
}

const MAX_LANES = 3;

export function calculateWeekEventLayout(
  weekStartDate: Date,
  weekEndDate: Date,
  events: Event[]
): WeekEventLayout {
  const multiDayEvents: Event[] = [];
  const allSingleDayEventsByDay: { [dayIndex: number]: Event[] } = {};

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
        if (!allSingleDayEventsByDay[dayIndex]) {
          allSingleDayEventsByDay[dayIndex] = [];
        }
        allSingleDayEventsByDay[dayIndex].push(event);
      }
    }
  }

  // 複数日イベントをレーンに配置
  const { segments: eventBands, hiddenEvents: hiddenMultiDayEvents } = assignEventLanes(multiDayEvents, weekStartDate, weekEndDate);
  const maxMultiDayLanes = eventBands.length > 0 ? Math.max(...eventBands.map(b => b.laneIndex)) + 1 : 0;

  // 各日について、複数日イベントが占有するレーン数を計算
  const lanesOccupiedByDay: { [dayIndex: number]: number } = {};
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    lanesOccupiedByDay[dayIndex] = 0;
  }

  for (const segment of eventBands) {
    for (let day = segment.startDayIndex; day <= segment.endDayIndex; day++) {
      lanesOccupiedByDay[day] = Math.max(lanesOccupiedByDay[day] || 0, segment.laneIndex + 1);
    }
  }

  // 各日で表示可能な単日イベント数を計算して振り分け
  const visibleSingleDayEventsByDay: { [dayIndex: number]: Event[] } = {};
  const hiddenSingleDayEventsByDay: { [dayIndex: number]: Event[] } = {};
  let totalHiddenCount = hiddenMultiDayEvents.length;

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const singleDayEvents = allSingleDayEventsByDay[dayIndex] || [];
    const occupiedLanes = lanesOccupiedByDay[dayIndex] || 0;
    const availableLanes = MAX_LANES - occupiedLanes;

    visibleSingleDayEventsByDay[dayIndex] = singleDayEvents.slice(0, availableLanes);
    hiddenSingleDayEventsByDay[dayIndex] = singleDayEvents.slice(availableLanes);

    totalHiddenCount += hiddenSingleDayEventsByDay[dayIndex]?.length || 0;
  }

  // すべての隠れたイベントをまとめる
  const allHiddenEvents = [
    ...hiddenMultiDayEvents,
    ...Object.values(hiddenSingleDayEventsByDay).flat()
  ];

  return {
    eventBands,
    singleDayEvents: visibleSingleDayEventsByDay,
    maxLanes: maxMultiDayLanes,
    hiddenEventsCount: totalHiddenCount,
    hiddenEvents: allHiddenEvents,
    hiddenEventsByDay: hiddenSingleDayEventsByDay
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
): { segments: EventSegment[]; hiddenEvents: Event[] } {
  const segments: EventSegment[] = [];
  const hiddenEvents: Event[] = [];
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

      const hasConflict = lanes[laneIndex]?.some(existingSegment =>
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
      lanes[assignedLane]?.push(segment);
    } else {
      // レーンに配置できない場合は隠れたイベントとして記録
      hiddenEvents.push(event);
    }
  }

  return { segments, hiddenEvents };
}

function segmentsOverlap(
  a: { startDayIndex: number; endDayIndex: number },
  b: { startDayIndex: number; endDayIndex: number }
): boolean {
  return a.startDayIndex <= b.endDayIndex && b.startDayIndex <= a.endDayIndex;
}