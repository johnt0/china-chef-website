import {Phone} from 'lucide-react';

function Hero() {
    return (
        <section
            id="top"
            className="relative overflow-hidden
                bg-[radial-gradient(118%_90%_at_50%_-14%,#FDF4F0_0%,#FBEAE8_44%,#F2D0CA_100%)]"
        >
            <div
                className="max-w-[clamp(1120px,_78vw,_1360px)] mx-auto px-6
                    text-center py-[clamp(3.5rem,_8vw,_6.75rem)]"
            >
                <div className="inline-flex items-center gap-[10px] mb-6">
                    <span
                        aria-hidden="true"
                        className="w-[26px] h-px bg-brand"
                    ></span>
                    <p
                        className="text-brand text-[clamp(0.75rem,3.5vw,1rem)] whitespace-nowrap tracking-wider
                        uppercase font-semibold"
                    >
                        Family Owned · Nottingham, MD
                    </p>
                    <span
                        aria-hidden="true"
                        className="w-[26px] h-px bg-brand"
                    ></span>
                </div>

                <h1
                    className="font-[Cormorant_Garamond,_serif] font-medium
                        text-[clamp(46px,7vw,86px)] leading-[1.02]
                        tracking-[-0.01em] text-ink-strong mb-6"
                >
                    <span className="text-[1.3em] font-semibold text-brand">
                        F
                    </span>
                    resh, generous, and made
                    <br />
                    with <em className="text-brand-deeper">family love.</em>
                </h1>
                <p
                    className="text-muted text-[clamp(15px,1.7vw,19px)]
                        leading-[1.7] max-w-[32em] mx-auto mb-9"
                >
                    Classic American &amp; Chinese cooking, made fresh to order.
                    Generous portions at a neighborhood price. Open 7 days a
                    week for pickup and delivery.
                </p>
                <div className="flex flex-wrap gap-[14px] justify-center">
                    
                    <address className="contents not-italic">
                        
                        <a
                        href="tel:+14108821088"
                        className="inline-flex items-center gap-[10px]
                            bg-brand text-white px-8 py-4 rounded no-underline
                            text-[15.5px] font-medium shadow-btn btn-press
                            hover:bg-brand-deep"
                        >
                        <Phone size={16}/>
                        Call to Order
                        </a>
                        <a
                            href="#menu"
                            className="inline-flex items-center gap-[10px]
                                bg-transparent text-ink px-8 py-4 rounded
                                no-underline text-[15.5px] font-medium
                                border-[1.5px] border-btn-border shadow-btn
                                btn-press hover:border-brand hover:text-brand"
                        >
                            Browse Full Menu
                        </a>
                    </address>
                </div>
            </div>
        </section>
    );
}

export default Hero;
