import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                'acc-height': {
                    from: { 'grid-template-rows': '0fr', opacity: '0' },
                    to: { 'grid-template-rows': '1fr', opacity: '1' },
                },
                'acc-fade-up': {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'dish-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'acc-height':
                    'accHeight 0.34s cubic-bezier(0.22, 0.61, 0.36, 1)',
                'acc-fade-up':
                    'accFadeUp 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) both',
                'dish-in':
                    'dishIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both',
            },
        },
    },
} satisfies Config;
