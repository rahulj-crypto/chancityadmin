import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../services/api';
import gsap from 'gsap';

/**
 * RegistrationToggle Component
 * Toggle button for opening/closing registration
 */
export default function RegistrationToggle({ onStatusChange }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleRef = useRef(null);
    const confirmRef = useRef(null);

    // Fetch initial status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const settings = await adminApi.getSettings();
                setIsOpen(settings.registration_open);
            } catch (err) {
                console.warn('Could not fetch settings:', err.message);
                setIsOpen(true); // Default to open
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, []);

    // Animate toggle on status change
    useEffect(() => {
        if (toggleRef.current && !isLoading) {
            gsap.to(toggleRef.current, {
                backgroundColor: isOpen ? '#22c55e' : '#ef4444',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }, [isOpen, isLoading]);

    // Show confirm dialog animation
    useEffect(() => {
        if (confirmRef.current) {
            if (showConfirm) {
                gsap.fromTo(confirmRef.current,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
                );
            }
        }
    }, [showConfirm]);

    const handleToggleClick = () => {
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setIsUpdating(true);
        try {
            const newStatus = !isOpen;
            await adminApi.updateSettings({ registration_open: newStatus });
            setIsOpen(newStatus);
            onStatusChange?.(newStatus);
        } catch (err) {
            alert('Failed to update registration status: ' + err.message);
        } finally {
            setIsUpdating(false);
            setShowConfirm(false);
        }
    };

    const handleCancel = () => {
        gsap.to(confirmRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.15,
            onComplete: () => setShowConfirm(false)
        });
    };

    if (isLoading) {
        return (
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[var(--color-text-muted)]">Loading status...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toggle Card */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            ref={toggleRef}
                            className={`w-4 h-4 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <div>
                            <h4 className="font-medium text-[var(--color-text-primary)]">
                                Registration Status
                            </h4>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {isOpen ? 'Registrations are open' : 'Registrations are closed'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleClick}
                        disabled={isUpdating}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${isOpen
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUpdating ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            isOpen ? 'Close Registration' : 'Open Registration'
                        )}
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div
                        ref={confirmRef}
                        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOpen ? 'bg-red-100' : 'bg-green-100'
                                }`}>
                                {isOpen ? (
                                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6m0-6l6 6" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {isOpen ? 'Close Registration?' : 'Open Registration?'}
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            {isOpen
                                ? 'This will prevent new teams from registering for the tournament. Existing registrations will be preserved.'
                                : 'This will allow new teams to register for the tournament.'}
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${isOpen
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }`}
                            >
                                {isOpen ? 'Yes, Close' : 'Yes, Open'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
