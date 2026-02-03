import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Modal Component
 * Reusable modal with GSAP animations
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(false);

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    // Handle open/close
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        }
    }, [isOpen]);

    // GSAP animations after render
    useEffect(() => {
        if (!shouldRender || !overlayRef.current || !contentRef.current) return;

        if (isOpen) {
            // Entrance animation
            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set(contentRef.current, { opacity: 0, scale: 0.95, y: 20 });

            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
            gsap.to(contentRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power3.out',
                delay: 0.1
            });
        } else {
            // Exit animation
            gsap.to(contentRef.current, {
                opacity: 0,
                scale: 0.95,
                y: 20,
                duration: 0.2,
                ease: 'power2.in'
            });
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.2,
                delay: 0.1,
                ease: 'power2.in',
                onComplete: () => {
                    setShouldRender(false);
                }
            });
        }
    }, [isOpen, shouldRender]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Don't render if not open
    if (!shouldRender) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            <div
                ref={contentRef}
                className={`${sizeClasses[size]} w-full bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-2xl max-h-[90vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
