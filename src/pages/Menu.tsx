import { useRef, useState } from 'react';
import { ChefHat as BadgeChefHat, Flame, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import menuData from '../data/menu.json';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '../data/categoryIcons';
import { priceOf, type Dish, type Category, type MenuData } from '../data/menuHelpers';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { animateScrollTo } from '../utils/smoothScroll';

interface DisplayItem {
    key: string;
    code: string;
    hasCode: boolean;
    name: string;
    detail: string;
    hasDetail: boolean;
    detailPadClass: string;
    spicy: boolean;
    price: string;
    hasSizedPrice: boolean;
    priceSm: string;
    priceLg: string;
    badgeIcon: LucideIcon | null;
    badgeLabel: string;
    badgeClass: string;
}

interface DisplayCategory {
    id: string;
    name: string;
    icon: LucideIcon;
    note: string;
    hasNote: boolean;
    items: DisplayItem[];
    count: number;
    countLabel: string;
}

const data = menuData as MenuData;

const SKIP_CATEGORIES = [
    'Lunch Special',
    'Special Plater',
    'Special Platter',
    'Party Special',
];

const mainCategories: Category[] = data.categories.filter(
    (c) => !SKIP_CATEGORIES.includes(c.name),
);

interface Badge {
    icon: LucideIcon;
    label: string;
    className: string;
}

const BADGES: Record<string, Badge> = {
    S12: {
        icon: Star,
        label: 'Best Seller',
        className: 'bg-badge-gold-bg text-badge-gold-text',
    },
    S7: {
        icon: Flame,
        label: 'Popular',
        className: 'bg-badge-rose-bg text-badge-rose-text',
    },
    S8: {
        icon: BadgeChefHat,
        label: 'House Favorite',
        className: 'bg-blush text-brand',
    },
};

function slug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function displayItem(item: Dish): DisplayItem {
    const hasCode = !!item.code;
    const badge = item.code ? BADGES[item.code] : undefined;
    const hasSizedPrice = !!(item.priceSm && item.priceLg);
    return {
        key: (item.code || '') + item.name,
        code: item.code || '',
        hasCode,
        name: item.name,
        detail: item.detail || '',
        hasDetail: !!item.detail,
        detailPadClass: hasCode ? 'pl-[51px]' : '',
        spicy: !!item.spicy,
        price: hasSizedPrice ? '' : priceOf(item),
        hasSizedPrice,
        priceSm: item.priceSm || '',
        priceLg: item.priceLg || '',
        badgeIcon: badge?.icon ?? null,
        badgeLabel: badge?.label || '',
        badgeClass: badge?.className || '',
    };
}

const chips = mainCategories.map((c) => ({
    id: slug(c.name),
    name: c.name,
}));

// Rough relative pixel weight of a rendered category card. Only used to
// balance the two-column layout, so absolute accuracy doesn't matter — just
// the ratios between categories of different sizes.
function estimateCategoryHeight(cat: DisplayCategory): number {
    const HEADER = 60; // card header row (icon + title + count)
    const BODY = 26; // body top/bottom padding
    const MARGIN = 16; // mb-4 gap below the card
    const NOTE = 42; // note paragraph, when present
    const ROW = 42; // one DishRow
    const DETAIL = 18; // extra line when a dish has detail text
    let h = HEADER + BODY + MARGIN + (cat.hasNote ? NOTE : 0);
    for (const it of cat.items) h += ROW + (it.hasDetail ? DETAIL : 0);
    return h;
}

// Greedily balance categories across `columnCount` columns, keeping menu
// source order intact: each category is dropped into whichever column is
// currently shortest. With columnCount === 1 everything lands in a single
// bucket in original order (used on mobile).
function packColumns(
    cats: DisplayCategory[],
    columnCount: number,
): DisplayCategory[][] {
    const cols: DisplayCategory[][] = Array.from(
        { length: columnCount },
        () => [],
    );
    const heights = new Array(columnCount).fill(0);
    for (const cat of cats) {
        let target = 0;
        for (let i = 1; i < columnCount; i++) {
            if (heights[i] < heights[target]) target = i;
        }
        cols[target].push(cat);
        heights[target] += estimateCategoryHeight(cat);
    }
    return cols;
}

// Connector stopwords: dropped from both the query and the dish text after
// normalization so their presence/absence never blocks a match (e.g. "w.",
// "with", "and", "&" are all treated as the same non-meaningful glue word).
const SEARCH_STOPWORDS = new Set(['with', 'w', 'and', 'n', 'in', 'on', 'the', 'a', 'of']);

// Lowercase and unify the various ways "with" shows up on the menu (the
// literal abbreviation "w.", "w/", or "&") into one word, then strip all
// remaining punctuation so it can't affect matching.
function normalizeSearchText(text: string): string {
    return text
        .toLowerCase()
        .replace(/\bw\/(?=\s|$)/g, ' with ')
        .replace(/\bw\.(?=\s|$)/g, ' with ')
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function meaningfulTokens(text: string): string[] {
    return normalizeSearchText(text)
        .split(/\s+/)
        .filter((t) => t && !SEARCH_STOPWORDS.has(t));
}

// Small iterative Levenshtein edit distance (two-row DP) used to tolerate
// minor typos in search queries, e.g. "brocolli" vs "broccoli".
function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let prevRow: number[] = new Array(b.length + 1);
    let currRow: number[] = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prevRow[j] = j;

    for (let i = 1; i <= a.length; i++) {
        currRow[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            currRow[j] = Math.min(
                prevRow[j] + 1, // deletion
                currRow[j - 1] + 1, // insertion
                prevRow[j - 1] + cost // substitution
            );
        }
        [prevRow, currRow] = [currRow, prevRow];
    }
    return prevRow[b.length];
}

function maxEditDistanceFor(tokenLength: number): number {
    if (tokenLength < 4) return 0;
    if (tokenLength <= 6) return 1;
    return 2;
}

function tokenMatchesHaystack(token: string, haystack: string, haystackWords: string[]): boolean {
    if (haystack.includes(token)) return true;

    const maxDist = maxEditDistanceFor(token.length);
    if (maxDist === 0) return false;

    return haystackWords.some((word) => levenshtein(token, word) <= maxDist);
}

function matchesFilter(item: Dish, q: string, spicyOnly: boolean) {
    if (spicyOnly && !item.spicy) return false;
    if (!q) return true;

    const tokens = meaningfulTokens(q);
    if (tokens.length === 0) return true;

    const haystack = normalizeSearchText(item.name + ' ' + (item.code || '') + ' ' + (item.detail || ''));
    const haystackWords = haystack.split(/\s+/).filter(Boolean);

    return tokens.every((t) => tokenMatchesHaystack(t, haystack, haystackWords));
}

function SearchInput({
    query,
    onSearch,
    hasQuery,
    onClear,
}: {
    query: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasQuery: boolean;
    onClear: () => void;
}) {
    return (
        <div className="relative flex-1 min-w-[220px]">
            <span
                className="absolute left-4 top-1/2 -translate-y-1/2
                    text-icon-muted text-[17px]"
            >
                ⌕
            </span>
            <input
                type="search"
                value={query}
                onChange={onSearch}
                placeholder="Search dishes"
                aria-label="Search menu items"
                className="w-full text-[15.5px] py-[15px] px-11
                    border-[1.5px] border-input-border rounded-[14px]
                    bg-white text-ink
                    shadow-input
                    transition-[border-color,box-shadow] duration-200
                    focus:outline-none focus:border-brand
                    focus:shadow-input-focus"
            />
            {hasQuery && (
                <button
                    onClick={onClear}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2
                        bg-transparent border-none cursor-pointer
                        text-[20px] leading-none text-icon-muted p-1.5
                        transition-colors duration-150 hover:text-brand"
                >
                    &times;
                </button>
            )}
        </div>
    );
}

function DishRow({ item }: { item: DisplayItem }) {
    return (
        <div
            className="group py-2 px-2.5 -mx-2.5 rounded-lg
                border-b border-menu-item-border
                transition-colors duration-200 ease-in-out
                hover:bg-row-hover"
        >
            <div className="flex items-baseline gap-2.5">
                {item.hasCode && (
                    <span
                        className="min-w-[30px] pr-2.5 border-r
                            border-menu-item-border text-right text-xs
                            font-semibold text-code-muted font-mono
                            tabular-nums shrink-0"
                    >
                        {item.code}
                    </span>
                )}
                <span className="font-medium text-dish-name text-[15px]">
                    {item.name}
                </span>
                {item.spicy && (
                    <span className="text-chili text-[13px] animate-spicy-pulse">●</span>
                )}
                {item.badgeLabel && item.badgeIcon && (
                    <span
                        className={`inline-flex items-center gap-1
                            text-[10px] font-bold tracking-[.03em]
                            uppercase py-[3px] px-2 rounded-full
                            whitespace-nowrap ${item.badgeClass}`}
                    >
                        <item.badgeIcon
                            className="w-[11px] h-[11px]"
                            aria-hidden="true"
                            strokeWidth={2.25}
                        />
                        {item.badgeLabel}
                    </span>
                )}
                <span
                    className="flex-1 border-b border-dotted
                        border-price-leader -translate-y-[3px] min-w-[14px]"
                />
                {item.hasSizedPrice ? (
                    <span
                        className="text-brand font-semibold text-[14.5px]
                            whitespace-nowrap transition-transform
                            duration-200 ease-in-out
                            group-hover:-translate-x-[3px]"
                    >
                        <span
                            className="text-code-muted font-semibold
                                text-[10px] uppercase tracking-[.03em]
                                mr-1 align-[1px]"
                        >
                            Sm
                        </span>
                        {item.priceSm}
                        <span
                            className="text-code-muted font-semibold
                                text-[10px] uppercase tracking-[.03em]
                                mx-1 align-[1px]"
                        >
                            Lg
                        </span>
                        {item.priceLg}
                    </span>
                ) : (
                    <span
                        className="text-brand font-semibold text-[14.5px]
                            whitespace-nowrap transition-transform
                            duration-200 ease-in-out
                            group-hover:-translate-x-[3px]"
                    >
                        {item.price}
                    </span>
                )}
            </div>
            {item.hasDetail && (
                <div
                    className={`text-xs text-detail-muted leading-snug
                        mt-px ${item.detailPadClass}`}
                >
                    {item.detail}
                </div>
            )}
        </div>
    );
}

function CategoryCard({
    cat,
    animKey,
}: {
    cat: DisplayCategory;
    animKey: string;
}) {
    return (
        <div
            id={cat.id}
            className="scroll-mt-[220px] mb-4
                bg-white border border-line rounded-xl overflow-hidden"
        >
            <div
                className="flex items-center gap-3.5 py-[17px] px-[22px]
                    bg-header-hover border-b border-menu-item-border"
            >
                <cat.icon
                    className="w-[22px] h-[22px] text-brand shrink-0"
                    aria-hidden="true"
                    strokeWidth={1.75}
                />
                <h3
                    className="font-[Cormorant_Garamond,_serif] text-[25px]
                        font-semibold m-0 text-ink-strong flex-1 min-w-0"
                >
                    {cat.name}
                </h3>
                <span
                    className="text-xs text-ink-soft font-medium
                        whitespace-nowrap"
                >
                    {cat.countLabel}
                </span>
            </div>

            <div className="py-1.5 px-[22px] pb-[18px]">
                {cat.hasNote && (
                    <p
                        className="text-[12.5px] text-ink-soft
                            leading-snug mt-3 mb-1"
                    >
                        {cat.note}
                    </p>
                )}
                <div key={animKey}>
                    {cat.items.map((item, i) => (
                        <div
                            key={item.key}
                            className="animate-dish-in"
                            style={{
                                animationDelay: `${Math.min(0.03 + i * 0.04, 0.4)}s`,
                            }}
                        >
                            <DishRow item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Menu() {
    const [query, setQuery] = useState('');
    const [spicyOnly, setSpicyOnly] = useState(false);
    const stickyBarRef = useRef<HTMLDivElement>(null);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const q = query.trim().toLowerCase();
    const hasQuery = q.length > 0;
    const showChips = !hasQuery;

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
        setQuery(e.target.value);
    const clearSearch = () => setQuery('');
    const toggleSpicy = () => setSpicyOnly((prev) => !prev);
    const resetFilters = () => {
        setQuery('');
        setSpicyOnly(false);
    };

    const jumpToCategory = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        const isModifiedClick =
            e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
        if (isModifiedClick) return;
        e.preventDefault();

        const target = document.getElementById(id);
        if (!target) return;
        const header = document.querySelector('header');
        const stickyBarHeight =
            stickyBarRef.current?.getBoundingClientRect().height ?? 0;
        const headerHeight = header?.getBoundingClientRect().height ?? 0;
        const offset = headerHeight + stickyBarHeight + 16;
        const top =
            target.getBoundingClientRect().top + window.scrollY - offset;
        animateScrollTo(top);
    };

    const categories: DisplayCategory[] = mainCategories
        .map((c) => {
            const id = slug(c.name);
            const items = c.items
                .filter((it) => matchesFilter(it, q, spicyOnly))
                .map(displayItem);
            const count = items.length;
            return {
                id,
                name: c.name,
                icon: CATEGORY_ICONS[c.name] ?? DEFAULT_CATEGORY_ICON,
                note: c.note || '',
                hasNote: !!c.note,
                items,
                count,
                countLabel: count === 1 ? '1 dish' : `${count} dishes`,
            };
        })
        .filter((c) => c.count > 0);

    const columns = packColumns(categories, isDesktop ? 2 : 1);

    const totalResults = categories.reduce((n, c) => n + c.count, 0);
    const resultLabel =
        totalResults === 1 ? '1 dish found' : `${totalResults} dishes found`;
    const noResults = categories.length === 0;
    const animKey = `${q}-${spicyOnly}`;

    return (
        <section
            id="menu"
            className="scroll-mt-[84px] bg-menu-bg border-t border-b
                border-line"
        >
            <div
                className="max-w-[clamp(1080px,_75vw,_1320px)] mx-auto
                    py-[clamp(56px,_7vw,_96px)] px-6"
            >
                <div className="text-center max-w-[38em] mx-auto mb-[44px]">
                    <p
                        className="text-[12.5px] tracking-[.2em] uppercase
                            text-brand font-semibold mb-[14px]"
                    >
                        The Full Menu
                    </p>
                    <h2
                        className="mb-4 font-[Cormorant_Garamond,_serif]
                            text-[clamp(34px,4.6vw,52px)] leading-[1.06]
                            font-medium text-ink-strong"
                    >
                        Every dish we make
                    </h2>
                    <p className="leading-[1.7] text-menu-desc">
                        Search by name or number, or jump to a section. Prices
                        shown small / large where offered. Entrées served with
                        white rice. <span className="text-chili animate-spicy-pulse">●</span> spicy.
                    </p>
                </div>

                <div
                    ref={stickyBarRef}
                    className="sticky top-[69px] z-30
                        bg-menu-bg/[0.94] backdrop-blur-[8px]
                        backdrop-saturate-[1.4] border-b border-sticky-border"
                >
                    <div className="max-w-[1120px] mx-auto pt-[14px] px-6">
                        <div className="flex flex-wrap gap-3 items-center">
                            <SearchInput
                                query={query}
                                onSearch={onSearch}
                                hasQuery={hasQuery}
                                onClear={clearSearch}
                            />

                            <button
                                onClick={toggleSpicy}
                                className={`inline-flex items-center gap-1.5
                                    text-[13px] font-semibold cursor-pointer
                                    py-[7px] px-[14px] rounded-full
                                    whitespace-nowrap border shadow-btn
                                    btn-press ${
                                        spicyOnly
                                            ? `bg-brand text-white
                                            border-brand`
                                            : `bg-white text-warm-gray
                                            border-input-border`
                                    }`}
                            >
                                ● Spicy only
                            </button>
                        </div>

                        {hasQuery && (
                            <div
                                className="py-[14px] px-[2px] text-sm
                                    text-menu-desc"
                            >
                                {resultLabel}
                            </div>
                        )}

                        {showChips && (
                            <div
                                className="flex flex-nowrap gap-2
                                    overflow-x-auto pt-[14px]
                                    pb-[24px] px-[2px]"
                            >
                                {chips.map((chip) => (
                                    <a
                                        key={chip.id}
                                        href={`#${chip.id}`}
                                        onClick={(e) =>
                                            jumpToCategory(e, chip.id)
                                        }
                                        className="flex-shrink-0 no-underline
                                            text-[13px] font-medium
                                            text-warm-gray bg-white
                                            border border-chip-border
                                            py-[7px] px-[14px]
                                            rounded-full whitespace-nowrap
                                            shadow-btn btn-press
                                            hover:border-brand
                                            hover:text-brand"
                                    >
                                        {chip.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className="max-w-[1120px] mx-auto
                        pt-[clamp(32px,4vw,48px)]"
                >
                    {noResults && (
                        <div className="text-center py-14">
                            <div
                                className="font-[Cormorant_Garamond,_serif]
                                    text-[30px] text-ink-strong mb-2"
                            >
                                No dishes found
                            </div>
                            <p
                                className="text-subtle text-[15px]
                                    mb-[18px]"
                            >
                                Try a different word, or clear the filters.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="text-sm font-semibold
                                    cursor-pointer py-[11px] px-[22px]
                                    rounded-lg bg-brand text-white
                                    border-none shadow-btn btn-press"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-x-6">
                        {columns.map((col, i) => (
                            <div key={i} className="flex-1 min-w-0">
                                {col.map((cat) => (
                                    <CategoryCard
                                        key={cat.id}
                                        cat={cat}
                                        animKey={animKey}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Menu;
