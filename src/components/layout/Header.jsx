import { useLocation } from 'react-router-dom';
import { memo } from 'react';

/**
 * Header Component
 * Page header with title and actions - light theme
 */
function Header({ onMenuClick }) {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('registrations')) return 'Registrations';
        return 'Admin';
    };

    const getPageSubtitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Workspace Overview';
        if (path.includes('registrations')) return 'Team Management';
        return '';
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-10 transition-all">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] active:scale-95 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>

                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
                            {getPageTitle()}
                        </h1>
                        <p className="hidden xs:block text-xs md:text-sm text-[var(--color-text-secondary)] mt-0.5 opacity-80">
                            {getPageSubtitle()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="p-2 md:p-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)] active:scale-95 transition-all"
                        title="Refresh"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M23 4v6h-6" />
                            <path d="M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default memo(Header);
