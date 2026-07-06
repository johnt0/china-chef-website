import { useEffect, useRef, useState } from 'react';
import {
    PHONE_DISPLAY,
    PHONE_HREF,
    ADDRESS,
    ADDRESS_STREET,
    ADDRESS_CITY,
} from '../data/contact';
import { getHoursStatus, type HoursStatus } from '../data/hours';
import { Phone, Clock, MapPin, ArrowRight } from 'lucide-react';

const ADDRESS_QUERY = ADDRESS.replaceAll(' ', '+');

function LazyLoadMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-[clamp(340px,42vw,480px)] bg-blush"
        >
            {shouldLoad ? (
                <iframe
                    title="Map to China Chef, 8623 Walther Blvd"
                    src={
                        'https://www.google.com/maps?q=' +
                        ADDRESS_QUERY +
                        '&output=embed'
                    }
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full border-0"
                />
            ) : (
                <div className="absolute inset-0" aria-hidden="true" />
            )}
        </div>
    );
}
function RowIcon({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="flex items-center justify-center shrink-0 w-11 h-11
                bg-blush text-brand rounded-[9px] text-lg"
        >
            {children}
        </span>
    );
}

function AddressRow() {
    return (
        <div className="flex gap-4 items-start">
            <RowIcon aria-hidden="true">
                {' '}
                <MapPin />{' '}
            </RowIcon>
            <div>
                <h3
                    className="font-semibold text-[15px]
                        text-ink mb-[5px]"
                >
                    Address
                </h3>
                <address
                    className="text-[16px] text-text-strong leading-[1.6]
                        not-italic"
                >
                    {ADDRESS_STREET}
                    <br />
                    {ADDRESS_CITY}
                </address>
                <a
                    href={'https://www.google.com/maps?q=' + ADDRESS_QUERY}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-[13.5px]
                        font-semibold text-brand no-underline hover:underline
                        whitespace-nowrap"
                >
                    Get directions <ArrowRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-divider-soft my-6" />;
}

function HoursLine({ day, time }: { day: string; time: string }) {
    return (
        <>
            <dt className="text-muted py-1">{day}</dt>
            <dd className="text-ink font-medium py-1 text-right">{time}</dd>
        </>
    );
}

type StatusStyle = {
    bg: string;
    dot: string;
    text: string;
    ringVar: string;
    label: string;
};

const STATUS_STYLES: Record<HoursStatus, StatusStyle> = {
    open: {
        bg: 'bg-badge-status-bg-open',
        dot: 'bg-success',
        text: 'text-badge-status-text-open',
        ringVar: '--color-badge-status-bg-open',
        label: 'Open',
    },
    'closing-soon': {
        bg: 'bg-badge-status-bg-soon',
        dot: 'bg-status-soon',
        text: 'text-badge-status-text-soon',
        ringVar: '--color-badge-status-bg-soon',
        label: 'Closing Soon',
    },
    closed: {
        bg: 'bg-badge-status-bg',
        dot: 'bg-status-closed',
        text: 'text-badge-status-text',
        ringVar: '--color-badge-status-bg',
        label: 'Closed',
    },
};

function HoursRow() {
    const status = getHoursStatus();
    const { bg, dot, text, ringVar, label } = STATUS_STYLES[status];
    return (
        <div className="flex gap-4 items-start">
            <RowIcon aria-hidden="true">
                <Clock />
            </RowIcon>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[15px] text-ink">
                        Hours · Open 7 Days
                    </h3>
                    <div
                        className={`
                            inline-flex items-center gap-[7px] text-[12px]
                            ${text} font-bold tracking-[0.02em] pt-[5px]
                            pr-[11px] pb-[5px] pl-[9px] ${bg} rounded-[20px]
                        `}
                    >
                        <span
                            className={`
                                w-[8px] h-[8px] rounded-[50%] shrink-0 ${dot}
                            `}
                            style={{
                                boxShadow: `var(${ringVar}) 0px 0px 0px 3px`,
                            }}
                        />
                        {label}
                    </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-2.5 text-[14.5px]">
                    <HoursLine day="Mon – Thu" time="11:00am – 10:00pm" />
                    <HoursLine day="Fri – Sat" time="11:00am – 11:00pm" />
                    <HoursLine day="Sunday" time="12:00pm – 10:00pm" />
                </dl>
            </div>
        </div>
    );
}

function PhoneRow() {
    return (
        <div className="flex gap-4 items-start">
            <RowIcon aria-hidden="true">
                <Phone />
            </RowIcon>
            <div>
                <h3
                    className="font-semibold text-[15px]
                        text-ink mb-[5px]"
                >
                    Phone
                </h3>
                <a
                    href={PHONE_HREF}
                    className="text-[24px] font-medium tracking-tight
                        tabular-nums text-brand no-underline leading-[1.1]"
                >
                    {PHONE_DISPLAY}
                </a>
                <div className="text-sm text-subtle mt-1.5">
                    Call ahead for pickup · Visa &amp; Mastercard
                </div>
            </div>
        </div>
    );
}

function VisitInfo() {
    return (
        <div className="p-[clamp(28px,3.2vw,44px)] flex flex-col">
            <AddressRow />
            <Divider />
            <HoursRow />
            <Divider />
            <PhoneRow />
        </div>
    );
}

function VisitCard() {
    return (
        <div
            className="grid grid-cols-[1.1fr_1fr]
                max-[800px]:grid-cols-1 bg-white border
                border-line rounded-2xl overflow-hidden
                shadow-card"
        >
            <LazyLoadMap />
            <VisitInfo />
        </div>
    );
}

function Visit() {
    return (
        <section id="visit" className="scroll-mt-[88px]">
            <div
                className="max-w-[1080px] mx-auto
                    pt-[clamp(56px,7vw,96px)] pb-[clamp(56px,7vw,96px)]
                    pl-[24px] pr-[24px]"
            >
                <div className="text-center max-w-[30em] mx-auto mb-[48px]">
                    <p
                        className="text-[12.5px] uppercase
                            text-brand font-semibold mb-[14px]
                            tracking-[0.2em]"
                    >
                        Visit Us
                    </p>
                    <h2
                        className="font-[Cormorant_Garamond,serif]
                            font-medium text-[clamp(34px,4.6vw,52px)]
                            leading-[1.06] text-ink-strong"
                    >
                        Find us in Nottingham
                    </h2>
                </div>
                <VisitCard />
                <div className="text-center mt-[28px] mx-auto">
                    <p className="text-[14px] text-muted">
                        Delivery charges may apply · $15.00 order minimum ·
                        limited area
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Visit;
