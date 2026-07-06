import { navItems } from '../data/navigation';
import Logo from '../assets/logo.svg?react';
function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id="Footer" className="bg-maroon text-cream-muted">
            <div
                className={`
                    max-w-[1080px] mx-auto pt-[clamp(44px,6vw,64px)]
                    px-[24px] pb-[clamp(26px,3vw,32px)] text-center
                `}
            >
                <div
                    className={`
                        flex items-center justify-center gap-[12px]
                        mb-[16px]
                    `}
                >
                    <div
                        className={`
                            flex items-center justify-center w-[40px]
                            h-[40px] bg-brand rounded-sm
                        `}
                    >
                        <Logo className="h-[30px] w-auto text-gold" />
                    </div>
                    <h2
                        className={`
                            font-[Parisienne,cursive] text-[26px]
                            font-semibold text-parchment
                        `}
                    >
                        China Chef
                    </h2>
                </div>
                <p
                    className={`
                        text-[14.5px] leading-[1.7] text-footer-muted
                        max-w-[30em] mx-auto mb-[26px]
                    `}
                >
                    A family-owned Chinese American kitchen serving fresh,
                    generous plates to Nottingham community.
                </p>
                <ul
                    className={`
                        flex flex-wrap gap-y-[8px] gap-x-[28px]
                        justify-center text-[14.5px] text-cream-muted
                        pb-[26px] border-b border-footer-border
                    `}
                >
                    {navItems.map(({ route, label }) => (
                        <li key={route}>
                            <a href={route} className="text-cream-muted">
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
                <span className="block text-[13px] text-footer-muted mt-[24px]">
                    &copy; {year} China Chef · 8623 Walther Blvd, Nottingham, MD
                    · Family owned &amp; operated.
                </span>
            </div>
        </footer>
    );
}

export default Footer;
