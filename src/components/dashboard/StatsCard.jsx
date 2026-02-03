import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * StatsCard Component
 * Individual stat display card with icon and count
 */
export default function StatsCard({ title, value, icon, color = 'primary', trend = null }) {
    const cardRef = useRef(null);

    // Color mappings
    const colorStyles = {
        primary: {
            bg: 'bg-[var(--color-primary-muted)]',
            text: 'text-[var(--color-primary)]',
            iconBg: 'bg-[var(--color-primary)]'
        },
        success: {
            bg: 'bg-[var(--color-success)]/10',
            text: 'text-[var(--color-success)]',
            iconBg: 'bg-[var(--color-success)]'
        },
        warning: {
            bg: 'bg-[var(--color-warning)]/10',
            text: 'text-[var(--color-warning)]',
            iconBg: 'bg-[var(--color-warning)]'
        },
        error: {
            bg: 'bg-[var(--color-error)]/10',
            text: 'text-[var(--color-error)]',
            iconBg: 'bg-[var(--color-error)]'
        }
    };

    const styles = colorStyles[color] || colorStyles.primary;

    // Hover animation
    useEffect(() => {
        const card = cardRef.current;

        const handleMouseEnter = () => {
            gsap.to(card, {
                y: -4,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                duration: 0.2,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                y: 0,
                boxShadow: 'none',
                duration: 0.2,
                ease: 'power2.out'
            });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`stats-card p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors cursor-pointer`}
        >
            <div className="flex items-start justify-between">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center text-white`}>
                    {icon}
                </div>

                {/* Trend Indicator */}
                {trend !== null && (
                    <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="17 11 12 6 7 11" />
                            <line x1="12" y1="6" x2="12" y2="18" />
                        </svg>
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="mt-4">
                <p className={`text-3xl font-bold ${styles.text}`}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {title}
                </p>
            </div>
        </div>
    );
}
