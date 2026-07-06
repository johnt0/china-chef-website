export type HoursRange = { open: number; close: number };

// Hours in decimal 24h time, indexed by Date#getDay() (0 = Sunday)
export const SCHEDULE: HoursRange[] = [
    { open: 12, close: 22 }, // Sun
    { open: 11, close: 22 }, // Mon
    { open: 11, close: 22 }, // Tue
    { open: 11, close: 22 }, // Wed
    { open: 11, close: 22 }, // Thu
    { open: 11, close: 23 }, // Fri
    { open: 11, close: 23 }, // Sat
];

export type HoursStatus = 'open' | 'closing-soon' | 'closed';

const CLOSING_SOON_WINDOW_HOURS = 0.5;

export function getHoursStatus(now: Date = new Date()): HoursStatus {
    const { open, close } = SCHEDULE[now.getDay()];
    const hours = now.getHours() + now.getMinutes() / 60;
    if (hours < open || hours >= close) return 'closed';
    if (close - hours <= CLOSING_SOON_WINDOW_HOURS) return 'closing-soon';
    return 'open';
}

export function formatHour(hour: number): string {
    const wholeHour = Math.floor(hour);
    const minutes = Math.round((hour - wholeHour) * 60);
    const period = wholeHour >= 12 ? 'PM' : 'AM';
    const displayHour = wholeHour % 12 === 0 ? 12 : wholeHour % 12;
    return minutes === 0
        ? `${displayHour} ${period}`
        : `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function getHoursMessage(now: Date = new Date()): string {
    const day = now.getDay();
    const { open, close } = SCHEDULE[day];
    const hours = now.getHours() + now.getMinutes() / 60;

    if (hours >= open && hours < close) {
        return getHoursStatus(now) === 'closing-soon'
            ? `Closes at ${formatHour(close)}`
            : `Open until ${formatHour(close)}`;
    }
    if (hours < open) return `Opens at ${formatHour(open)}`;
    return `Opens tomorrow at ${formatHour(SCHEDULE[(day + 1) % 7].open)}`;
}
