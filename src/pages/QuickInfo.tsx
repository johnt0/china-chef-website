import { ADDRESS_STREET } from '../data/contact';
import {
    getHoursMessage,
    getHoursStatus,
    type HoursStatus,
} from '../data/hours';

type StatusStyle = { bg: string; dot: string; text: string; word: string };

const STATUS_STYLES: Record<HoursStatus, StatusStyle> = {
    open: {
        bg: 'bg-badge-status-bg-open',
        dot: 'bg-success',
        text: 'text-badge-status-text-open',
        word: 'Open now',
    },
    'closing-soon': {
        bg: 'bg-badge-status-bg-soon',
        dot: 'bg-status-soon',
        text: 'text-badge-status-text-soon',
        word: 'Closing soon',
    },
    closed: {
        bg: 'bg-badge-status-bg',
        dot: 'bg-status-closed',
        text: 'text-badge-status-text',
        word: 'Closed',
    },
};

function QuickInfo() {
    const status = getHoursStatus();
    const { bg, dot, text, word } = STATUS_STYLES[status];
    const message = getHoursMessage();

    return (
        <section className="bg-quickinfo-bg">
            <div
                className="max-w-[1000px] mx-auto px-6
                    pb-[clamp(40px,5vw,56px)]"
            >
                <div
                    data-reveal
                    className="max-w-[640px] mx-auto bg-white border
                        border-line rounded-[14px] overflow-hidden
                        shadow-specials-card"
                >
                    <div
                        className="p-[clamp(24px,3vw,32px)] flex flex-col
                            items-center gap-3.5 text-center"
                    >
                        <div
                            className="flex items-center flex-wrap
                                justify-center gap-2.5"
                        >
                            <span
                                className={`
                                    inline-flex items-center gap-[7px]
                                    text-[12px] font-bold tracking-[0.02em]
                                    pt-[5px] pr-[11px] pb-[5px] pl-[9px]
                                    rounded-[20px] ${bg} ${text}
                                `}
                            >
                                <span
                                    className={`
                                        w-[8px] h-[8px] rounded-[50%]
                                        shrink-0 ${dot}
                                    `}
                                />
                                {word}
                            </span>
                            <span className="text-[13px] text-ink-soft">
                                {message}
                            </span>
                        </div>
                        <div
                            className="flex flex-wrap justify-center
                                gap-[6px_28px] text-sm"
                        >
                            <span className="text-muted">
                                Mon–Thu{' '}
                                <span className="text-ink font-medium">
                                    11a–10p
                                </span>
                            </span>
                            <span className="text-muted">
                                Fri–Sat{' '}
                                <span className="text-ink font-medium">
                                    11a–11p
                                </span>
                            </span>
                            <span className="text-muted">
                                Sun{' '}
                                <span className="text-ink font-medium">
                                    12p–10p
                                </span>
                            </span>
                        </div>
                        <a
                            href="#visit"
                            className="text-[13.5px] text-brand-deep
                                no-underline font-semibold hover:underline"
                        >
                            {ADDRESS_STREET} — map &amp; directions →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default QuickInfo;
