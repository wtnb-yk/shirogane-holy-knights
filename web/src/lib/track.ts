type EventProps = {
  action?: string;
  targetId?: string;
  page?: string;
};

export function track(type: string, props?: EventProps): void {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) return;

  const body = JSON.stringify({ type, ...props });
  navigator.sendBeacon('/api/events', new Blob([body], { type: 'text/plain' }));
}
