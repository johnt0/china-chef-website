import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

export function useReveal<T extends HTMLElement = HTMLDivElement>(delayMs = 0) {
    const ref = useRef<T>(null);
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );
    const [observerRevealed, setObserverRevealed] = useState(false);
    const revealed = observerRevealed || prefersReducedMotion;

    useEffect(() => {
        if (prefersReducedMotion) return;

        const el = ref.current;
        if (!el) return;

        let timeoutId: number | undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    timeoutId = window.setTimeout(
                        () => setObserverRevealed(true),
                        delayMs,
                    );
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        };
    }, [prefersReducedMotion, delayMs]);

    const className = prefersReducedMotion
        ? ''
        : revealed
          ? 'animate-acc-fade-up'
          : 'opacity-0';

    return { ref, className };
}
