import { useState } from 'react';
import menuData from '../data/menu.json';
import { priceOf, type Dish, type Category, type MenuData } from '../data/menuHelpers';

const data = menuData as MenuData;

const lunchCategory =
    data.categories.find((c) => c.name === 'Lunch Special') ?? null;
const platterCategory =
    data.categories.find(
        (c) => c.name === 'Special Plater' || c.name === 'Special Platter',
    ) ?? null;

interface DisplayItem {
    key: string;
    code: string;
    hasCode: boolean;
    name: string;
    detail: string;
    hasDetail: boolean;
    spicy: boolean;
    price: string;
}

function displayItem(item: Dish): DisplayItem {
    return {
        key: (item.code || '') + item.name,
        code: item.code || '',
        hasCode: !!item.code,
        name: item.name,
        detail: item.detail || '',
        hasDetail: !!item.detail,
        spicy: !!item.spicy,
        price: priceOf(item),
    };
}

function Value() {
    const [special, setSpecial] = useState<'lunch' | 'platter' | null>(null);

    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const day = now.getDay();
    const nowLunch = day >= 1 && day <= 6 && h >= 11 && h < 15;

    const eff = special ?? (nowLunch ? 'lunch' : 'platter');
    const isLunch = eff === 'lunch';

    const activeCat: Category | null = isLunch
        ? lunchCategory
        : platterCategory;
    const specialItems = (activeCat?.items ?? []).map(displayItem);
    const specialNote = activeCat?.note || '';

    const availNote = nowLunch
        ? 'Available now — Lunch Special is served until 3:00 PM.'
        : 'Serving the all-day Special Platter now. Lunch Special ' +
          'returns 11:00 AM, Mon–Sat.';

    return (
        // Section band
        <section
            id="value"
            className={`
                scroll-mt-[88px] bg-menu-bg
                border-t border-t-line
            `}
        >
            {/* Content column */}
            <div
                className={`
                    max-w-[1000px] mx-auto
                    p-[clamp(48px,6vw,80px)_24px_clamp(48px,6vw,72px)]
                `}
            >
                {/* Intro text */}
                <div
                    data-reveal
                    className="text-center max-w-[40em] m-[0_auto_32px]"
                >
                    {/* Eyebrow label */}
                    <div
                        className={`
                            text-[12.5px] tracking-[.2em] uppercase
                            text-brand font-bold mb-[14px]
                        `}
                    >
                        Best Value
                    </div>
                    <h2
                        className={`
                            font-[Cormorant_Garamond,serif] font-semibold
                            text-[clamp(32px,4.4vw,50px)] leading-[1.06]
                            m-[0_0_14px] text-ink-strong
                        `}
                    >
                        Pick your dish, pick your protein
                    </h2>
                    <div
                        className={`
                            flex items-center justify-center gap-3
                            mb-[14px]
                        `}
                    >
                        <span className="w-[22px] h-px bg-divider-rose"></span>
                        <span
                            className={`
                                text-[13px] tracking-[.16em] uppercase
                                font-bold text-brand-deep
                            `}
                        >
                            Lunch Special · Mon–Sat · 11:00 AM – 3:00 PM
                        </span>
                        <span className="w-[22px] h-px bg-divider-rose"></span>
                    </div>
                    <p className="text-[16px] leading-[1.7] text-menu-desc">
                        The same crowd-pleasing format two way: a midday{' '}
                        <strong>Lunch Special</strong> and the all-day{' '}
                        <strong>Special Platter</strong>. Both come as a full
                        plate with rice, an egg roll or soup.
                    </p>
                </div>
                {/* Specials card */}
                <div
                    data-reveal
                    data-reveal-delay="60"
                    className={`
                        bg-white border border-line rounded-[14px]
                        shadow-specials-card overflow-hidden
                    `}
                >
                    {/* Header row: tabs + spicy legend */}
                    <div
                        className={`
                            p-[22px_24px] border-b border-divider-soft
                            flex flex-wrap gap-4 items-center
                            justify-between
                        `}
                    >
                        {/* Tab pill */}
                        <div
                            className={`
                                inline-flex bg-divider-soft rounded-[9px]
                                p-[4px] gap-[4px]
                            `}
                        >
                            <button
                                onClick={() => setSpecial('lunch')}
                                className={`
                                    cursor-pointer text-[14.5px] font-bold
                                    py-[10px] px-[20px] rounded-[6px]
                                    transition-all duration-150
                                    ${
                                        isLunch
                                            ? 'bg-brand text-gold'
                                            : 'bg-transparent text-muted'
                                    }
                                `}
                            >
                                Lunch Special
                            </button>
                            <button
                                onClick={() => setSpecial('platter')}
                                className={`
                                    cursor-pointer text-[14.5px] font-bold
                                    py-[10px] px-[20px] rounded-[6px]
                                    transition-all duration-150
                                    ${
                                        !isLunch
                                            ? 'bg-brand text-gold'
                                            : 'bg-transparent text-muted'
                                    }
                                `}
                            >
                                Special Platter
                            </button>
                        </div>
                        {/* Spicy legend */}
                        <div
                            className={`
                                flex items-center pt-[1px] gap-[8px] text-[13px]
                                text-ink-soft
                            `}
                        >
                            <span className="text-chili text-[12px] animate-spicy-pulse">●</span>{' '}
                            indicates a spicy dish
                        </div>
                    </div>
                    {/* Availability strip */}
                    <div
                        className={`
                            p-[11px_24px] bg-availability-bg
                            flex items-center gap-[9px] text-[12.5px]
                            font-bold text-brand
                        `}
                    >
                        <span
                            className={`
                                w-[8px] h-[8px] rounded-[50%] bg-success
                                shadow-[0_0_0_3px_rgba(77,140,87,.28)]
                                shrink-0
                            `}
                        ></span>
                        {availNote}
                    </div>
                    {/* Special note strip */}
                    {specialNote && (
                        <div
                            className={`
                                p-[16px_24px] bg-header-hover
                                border-b border-divider-soft
                                text-[13.5px] text-note-warm leading-[1.6]
                            `}
                        >
                            {specialNote}
                        </div>
                    )}
                    {/* Dish grid */}
                    <div className="p-[22px_24px_26px] bg-special-panel">
                        <div
                            className={`
                                grid gap-[2px_30px]
                                grid-cols-[repeat(auto-fill,minmax(224px,1fr))]
                            `}
                        >
                            {specialItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="group py-[9px] px-2 -mx-2
                                        rounded-lg border-b
                                        border-menu-item-border
                                        transition-colors duration-200
                                        ease-in-out
                                        hover:bg-panel-row-hover"
                                >
                                    <div
                                        className="flex items-baseline
                                            gap-2.5"
                                    >
                                        {item.hasCode && (
                                            <span
                                                className="min-w-[34px]
                                                    text-[12px] font-semibold
                                                    text-code-muted
                                                    tracking-[.02em]
                                                    shrink-0"
                                            >
                                                {item.code}
                                            </span>
                                        )}
                                        <span
                                            className="font-medium
                                                text-dish-name text-[15px]"
                                        >
                                            {item.name}
                                        </span>
                                        {item.spicy && (
                                            <span
                                                className="text-chili
                                                    text-[13px]"
                                            >
                                                ●
                                            </span>
                                        )}
                                        <span
                                            className="flex-1 border-b
                                                border-dotted
                                                border-price-leader
                                                -translate-y-[3px]
                                                min-w-[14px]"
                                        />
                                        <span
                                            className="text-brand
                                                font-semibold text-[14.5px]
                                                whitespace-nowrap
                                                transition-transform
                                                duration-200 ease-in-out
                                                group-hover:-translate-x-[3px]"
                                        >
                                            {item.price}
                                        </span>
                                    </div>
                                    {item.hasDetail && (
                                        <div
                                            className="text-[12px]
                                                text-detail-muted
                                                leading-snug mt-px
                                                pl-[44px]"
                                        >
                                            {item.detail}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Value;
