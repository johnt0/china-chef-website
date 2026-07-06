import Logo from '../assets/logo.svg?react';
import { useReveal } from '../hooks/useReveal';

function Story() {
    const { ref, className } = useReveal<HTMLDivElement>();

    return (
        <section
            id="story"
            className="scroll-mt-[88px] bg-maroon text-parchment"
        >
            <div
                ref={ref}
                className={`max-w-[760px] mx-auto
                    py-[clamp(64px,_8vw,_110px)] px-6 text-center ${className}`}
            >
                <div
                    className="flex items-center justify-center
                        w-[96px] h-[96px] mx-auto mb-7 bg-brand
                        rounded-[8px]
                        shadow-badge"
                >
                    <Logo className="h-[63px] w-auto text-gold" />
                </div>
                <p
                    className="text-[12.5px] tracking-[0.2em]
                        uppercase text-rose font-semibold mb-5"
                >
                    Our Story
                </p>
                <h2
                    className="font-[Cormorant_Garamond,_serif]
                        text-[clamp(34px,4.8vw,54px)] font-medium
                        leading-[1.08] mb-7 text-parchment"
                >
                    A family kitchen, <br />
                    here for the neighborhood
                </h2>
                <p className="text-[18px] leading-[1.8] text-cream-muted mb-5">
                    We're a family owned Chinese American restaurant dedicated
                    to preparing fresh, flavorful meals for the community.
                    Whether you're stopping by for a quick lunch or dinner with
                    family, we appreciate the opportunity to serve you.
                </p>
                <p className="text-[18px] leading-[1.8] text-cream-muted mb-8">
                    Thank you for supporting a local business. We look forward
                    to cooking for you.
                </p>
                <p
                    className="font-[Cormorant_Garamond,_serif] italic
                        text-[26px] text-parchment"
                >
                    — The China Chef Family
                </p>
            </div>
        </section>
    );
}

export default Story;
