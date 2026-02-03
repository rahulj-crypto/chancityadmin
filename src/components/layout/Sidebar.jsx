import { useEffect, useRef, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import gsap from 'gsap';

/**
 * Sidebar Component
 * Navigation sidebar - dark theme matching mockup
 */
function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // GSAP entrance animation - only on mount
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.nav-item', {
                x: -20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
                delay: 0.1
            });
        }, sidebarRef);

        return () => ctx.revert();
    }, []);

    const navItems = [
        {
            to: '/dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m6-12h-6M7 12H1m18 0h-6" />
                </svg>
            ),
            label: 'Dashboard'
        },
        {
            to: '/registrations',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            label: 'Registrations'
        }
    ];

    return (
        <aside
            ref={sidebarRef}
            className={`fixed left-0 top-0 h-full w-[var(--spacing-sidebar)] bg-[var(--color-sidebar)] border-r border-[#3a3a3a] flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-[#3a3a3a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.jpg"
                        alt="Chancity Logo"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover"
                    />
                    <div>
                        <h1 className="text-md md:text-lg font-bold text-[var(--color-primary)]">
                            Admin
                        </h1>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="md:hidden text-white p-1"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `nav-item flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-[var(--color-primary)] text-[var(--color-sidebar)] shadow-lg shadow-[var(--color-primary)]/20'
                                : 'text-[var(--color-text-sidebar-muted)] hover:bg-[#3a3a3a] hover:text-[var(--color-text-sidebar)]'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-[#3a3a3a]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-sidebar-muted)] hover:bg-[#321c1c] hover:text-red-400 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default memo(Sidebar);
