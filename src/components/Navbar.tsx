import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Logo from '../assets/logo.svg?react';
import { navItems } from '../data/navigation';
import { useActiveSection } from '../hooks/useActiveSection';
import { animateScrollTo, scrollToElement } from '../utils/smoothScroll';

const navRoutes = navItems.map((item) => item.route);

const MENU_TRANSITION_MS = 280;

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [renderMenu, setRenderMenu] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const active = useActiveSection(navRoutes);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const update = () =>
            setHeaderHeight(headerRef.current?.offsetHeight ?? 0);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            setRenderMenu(true);
            const raf = requestAnimationFrame(() => setAnimateIn(true));
            return () => cancelAnimationFrame(raf);
        }
        setAnimateIn(false);
        const timeout = window.setTimeout(
            () => setRenderMenu(false),
            MENU_TRANSITION_MS,
        );
        return () => window.clearTimeout(timeout);
    }, [menuOpen]);

    const navigateToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        route: string,
    ) => {
        const isModifiedClick =
            e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
        if (isModifiedClick) return;
        e.preventDefault();

        const runScroll = () => {
            const target = document.getElementById(route.slice(1));
            scrollToElement(target, headerHeight + 16);
        };

        if (menuOpen) {
            setMenuOpen(false);
            window.setTimeout(runScroll, MENU_TRANSITION_MS);
        } else {
            runScroll();
        }

        history.pushState(null, '', route);
    };

    useEffect(() => {
        if (!renderMenu) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        firstMobileLinkRef.current?.focus();
        const onKey = (e: KeyboardEvent) =>
            e.key === 'Escape' && setMenuOpen(false);
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
            menuButtonRef.current?.focus();
        };
    }, [renderMenu]);

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-50 bg-cream/88 border-b
                border-line backdrop-blur-md"
        >
            <nav
                className="max-w-[clamp(1120px,_78vw,_1360px)] mx-auto
                    px-6 py-[14px] flex items-center justify-between
                    gap-5"
            >
                <a
                    href="#top"
                    onClick={(e) => {
                        e.preventDefault();
                        animateScrollTo(0);
                        if (window.location.hash) {
                            history.pushState(
                                null,
                                '',
                                window.location.pathname +
                                    window.location.search,
                            );
                        }
                    }}
                    className="flex items-center gap-3 no-underline
                        text-inherit transition-transform duration-300
                        ease-[cubic-bezier(0.22,0.61,0.36,1)]
                        active:scale-95"
                >
                    <div
                        className="flex items-center justify-center
                            w-[42px] h-[42px] bg-brand rounded-[4px]
                            shadow-logo"
                    >
                        <Logo className="h-[26px] w-auto text-gold" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span
                            className="font-[Parisienne,cursive]
                                text-[26px] leading-none text-ink"
                        >
                            China Chef
                        </span>
                        <span
                            className="text-[10px] tracking-[.22em]
                                uppercase text-brand mt-1"
                        >
                            Chinese Food To Take Out
                        </span>
                    </div>
                </a>

                <ul className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = active === item.route;
                        return (
                            <li key={item.route}>
                                <a
                                    href={item.route}
                                    onClick={(e) =>
                                        navigateToSection(e, item.route)
                                    }
                                    aria-current={isActive ? 'true' : undefined}
                                    className="link-underline no-underline
                                        font-semibold text-[15px] pb-[4px]
                                        text-ink focus-visible:outline-none"
                                >
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                    <li>
                        <a
                            href="tel:+14108821088"
                            className="btn-press shadow-btn inline-flex
                                items-center gap-2 bg-brand text-white px-5
                                py-[11px] rounded no-underline text-sm
                                tabular-nums hover:bg-brand-deep"
                        >
                            410-882-1088
                        </a>
                    </li>
                </ul>

                <button
                    ref={menuButtonRef}
                    type="button"
                    className="md:hidden inline-flex
            flex-col justify-center gap-[5px] w-9 h-9 p-2
            bg-transparent border-none cursor-pointer"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                >
                    <span
                        className={`w-6 h-0.5 bg-ink block origin-center
                            transition-transform duration-300
                            ease-[cubic-bezier(0.22,0.61,0.36,1)]
                            ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                    />
                    <span
                        className={`w-6 h-0.5 bg-ink block
                            transition-opacity duration-200 ease-out
                            ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <span
                        className={`w-6 h-0.5 bg-ink block origin-center
                            transition-transform duration-300
                            ease-[cubic-bezier(0.22,0.61,0.36,1)]
                            ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                    />
                </button>
            </nav>

            {renderMenu &&
                createPortal(
                    <>
                        <div
                            style={{ top: headerHeight }}
                            className={`md:hidden fixed inset-x-0 bottom-0
                                z-[60] bg-maroon/70 transition-opacity
                                duration-300 ease-out
                                ${animateIn ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setMenuOpen(false)}
                            aria-hidden="true"
                        />
                        <div
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation"
                            style={{ top: headerHeight }}
                            className={`md:hidden fixed right-0 bottom-0
                                z-[70] w-[85%] max-w-[360px] bg-cream
                                shadow-2xl flex flex-col px-6 py-6
                                overflow-y-auto
                                transition-transform duration-300 ease-out
                                will-change-transform
                                ${
                                    animateIn
                                        ? 'translate-x-0'
                                        : 'translate-x-full'
                                }`}
                        >
                            {navItems.map((item, index) => (
                                <a
                                    key={item.route}
                                    ref={
                                        index === 0
                                            ? firstMobileLinkRef
                                            : undefined
                                    }
                                    href={item.route}
                                    onClick={(e) =>
                                        navigateToSection(e, item.route)
                                    }
                                    aria-current={
                                        active === item.route
                                            ? 'true'
                                            : undefined
                                    }
                                    style={{
                                        transitionDelay: animateIn
                                            ? `${index * 30}ms`
                                            : '0ms',
                                    }}
                                    className={`
                  no-underline text-ink font-[Cormorant_Garamond,_serif]
                  text-[30px]
                  py-[14px] border-b border-line block
                  transition-[opacity,transform] duration-300 ease-out
                  ${
                      animateIn
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2'
                  }
                  ${active === item.route ? 'text-brand' : ''}
                `}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <a
                                href="tel:+14108821088"
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    transitionDelay: animateIn
                                        ? `${navItems.length * 30}ms`
                                        : '0ms',
                                }}
                                className={`mt-6 text-center bg-brand
                                    text-white p-4 rounded no-underline
                                    text-base font-medium
                                    transition-[opacity,transform]
                                    duration-300 ease-out
                                    ${
                                        animateIn
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-2'
                                    }`}
                            >
                                Call to Order — 410-882-1088
                            </a>
                        </div>
                    </>,
                    document.body,
                )}
        </header>
    );
}

export default Navbar;
