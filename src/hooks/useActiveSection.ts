import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[], offset = 120) {
    const [active, setActive] = useState('');

    useEffect(() => {
        const sections = ids
            .map((id) => document.getElementById(id.slice(1)))
            .filter((el): el is HTMLElement => el !== null);
        if (sections.length === 0) return;

        const intersecting = new Set<Element>();

        const pickActive = () => {
            const topmost = Array.from(intersecting).sort(
                (a, b) =>
                    a.getBoundingClientRect().top -
                    b.getBoundingClientRect().top,
            )[0];
            setActive(topmost ? '#' + topmost.id : '');
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        intersecting.add(entry.target);
                    } else {
                        intersecting.delete(entry.target);
                    }
                });
                pickActive();
            },
            { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 },
        );

        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, [ids, offset]);

    return active;
}
