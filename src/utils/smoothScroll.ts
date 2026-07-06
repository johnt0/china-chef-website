const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const MIN_DURATION_MS = 350;
const MAX_DURATION_MS = 800;
const DURATION_PER_PX = 0.6;

let activeAnimationId = 0;
let cancelListenersAttached = false;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureCancelOnUserScroll() {
    if (cancelListenersAttached) return;
    cancelListenersAttached = true;
    const cancel = () => {
        activeAnimationId++;
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
}

export function animateScrollTo(targetY: number) {
    const clampedTarget = Math.max(0, targetY);
    const startY = window.scrollY;
    const distance = clampedTarget - startY;

    if (prefersReducedMotion() || Math.abs(distance) < 1) {
        window.scrollTo(0, clampedTarget);
        return;
    }

    ensureCancelOnUserScroll();

    const duration = Math.min(
        MAX_DURATION_MS,
        Math.max(MIN_DURATION_MS, Math.abs(distance) * DURATION_PER_PX),
    );
    const animationId = ++activeAnimationId;
    const startTime = performance.now();

    const step = (now: number) => {
        if (animationId !== activeAnimationId) return;
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        window.scrollTo(0, startY + distance * easeOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
}

export function scrollToElement(target: Element | null, offset = 0) {
    if (!target) return;
    const targetY =
        target.getBoundingClientRect().top + window.scrollY - offset;
    animateScrollTo(targetY);
}
