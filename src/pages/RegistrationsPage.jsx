import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { adminApi } from '../services/api';
import gsap from 'gsap';

// Memoized Table Row for performance
const TableRow = memo(({ registration, onOpen, formatDate }) => (
    <tr
        className="table-row border-b border-[var(--color-border)] hover:bg-[rgba(var(--color-primary-rgb),0.02)] transition-colors cursor-pointer"
        onClick={() => onOpen(registration)}
    >
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs">
                    {(registration.team_name || 'T').charAt(0)}
                </div>
                <span className="font-medium text-[var(--color-text-primary)]">
                    {registration.team_name}
                </span>
            </div>
        </td>
        <td className="px-6 py-4 text-[var(--color-text-secondary)]">
            {registration.contact_person}
        </td>
        <td className="px-6 py-4">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                {registration.category || 'N/A'}
            </span>
        </td>
        <td className="px-6 py-4 text-[var(--color-text-secondary)]">
            {formatDate(registration.$createdAt)}
        </td>
        <td className="px-6 py-4 text-right">
            <button
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                onClick={(e) => { e.stopPropagation(); onOpen(registration); }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </button>
        </td>
    </tr>
));

/**
 * RegistrationsPage Component
 * Optimized for mobile and fast response
 */
export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    const tableRef = useRef(null);
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const searchTimeout = useRef(null);

    // Optimized Debounce search
    useEffect(() => {
        searchTimeout.current = setTimeout(() => {
            setDebouncedSearch(search);
        }, 350); // Faster response

        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    const fetchRegistrations = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await adminApi.getRegistrations({
                search: debouncedSearch,
                status: statusFilter
            });
            setRegistrations(data.data || []);
        } catch (apiError) {
            console.warn('API error:', apiError.message);
            setRegistrations([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, statusFilter]);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    useEffect(() => {
        if (!isLoading && tableRef.current && registrations.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.table-row', {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: 0.03, // Faster stagger
                    ease: 'power1.out'
                });
            }, tableRef);
            return () => ctx.revert();
        }
    }, [isLoading, registrations]);

    const openModal = useCallback((registration) => {
        setSelectedRegistration(registration);
        if (modalRef.current) {
            modalRef.current.style.display = 'flex';
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
            gsap.fromTo(modalContentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
        }
    }, []);

    const closeModal = useCallback(() => {
        if (modalRef.current) {
            gsap.to(modalContentRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.2,
                onComplete: () => {
                    gsap.to(modalRef.current, {
                        opacity: 0,
                        duration: 0.15,
                        onComplete: () => {
                            modalRef.current.style.display = 'none';
                            setSelectedRegistration(null);
                        }
                    });
                }
            });
        }
    }, []);

    const handleDelete = useCallback(async (id) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        try {
            await adminApi.deleteRegistration(id);
            setRegistrations(prev => prev.filter(r => r.$id !== id));
            closeModal();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    }, [closeModal]);

    const formatDate = useCallback((dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    }, []);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Filters */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-3 md:p-4">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M7 12h10M10 18h4" />
                    </svg>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">Registration Entries</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search team or contact..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-4">
                        <div className="flex items-center gap-2 flex-1 md:flex-none">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full md:w-auto px-3 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none transition-all"
                            >
                                <option value="">All Categories</option>
                                <option value="Senior">Senior</option>
                                <option value="Junior">Junior</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div ref={tableRef} className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-[var(--color-text-secondary)] animate-pulse">Syncing data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                                    <th className="px-4 py-4 text-left font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-[10px]">Team Details</th>
                                    <th className="hidden md:table-cell px-4 py-4 text-left font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-[10px]">Category</th>
                                    <th className="hidden lg:table-cell px-4 py-4 text-left font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-[10px]">Contact Info</th>
                                    <th className="hidden md:table-cell px-4 py-4 text-left font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-[10px]">Date</th>
                                    <th className="px-4 py-4 text-center font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-[10px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-16 text-center text-[var(--color-text-muted)] italic">
                                            No registrations match your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((reg) => (
                                        <tr
                                            key={reg.$id}
                                            className="table-row group hover:bg-[rgba(var(--color-primary-rgb),0.02)] transition-all cursor-pointer"
                                            onClick={() => openModal(reg)}
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                        {(reg.team_name || 'T').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                                                            {reg.team_name || 'Anonymous Team'}
                                                        </p>
                                                        <p className="text-[10px] text-[var(--color-text-muted)] font-medium md:hidden">
                                                            {reg.category} • {reg.team_size || 0} Players
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-4">
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${reg.category === 'Senior'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                                    : 'bg-blue-50 text-blue-600 border-blue-200'
                                                    }`}>
                                                    {reg.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-4">
                                                <div className="space-y-0.5">
                                                    <p className="text-[var(--color-text-primary)] font-medium truncate max-w-[150px]">
                                                        {reg.contact_name}
                                                    </p>
                                                    <p className="text-[11px] text-[var(--color-text-secondary)] underline decoration-[var(--color-border)]">
                                                        {reg.phone}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-4 text-[var(--color-text-secondary)] font-medium">
                                                {formatDate(reg.$createdAt)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openModal(reg); }}
                                                        className="p-1 px-3 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] active:scale-95 transition-all"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <div
                ref={modalRef}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-md"
                style={{ display: 'none' }}
                onClick={(e) => {
                    if (e.target === modalRef.current) closeModal();
                }}
            >
                <div
                    ref={modalContentRef}
                    className="max-w-2xl w-full bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-[var(--color-border)]">
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Registration Info</h2>
                            <p className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase tracking-widest">
                                ID: {selectedRegistration?.$id?.slice(-8)}
                            </p>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-red-500 transition-all active:scale-90"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
                        {selectedRegistration && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em]">Team Data</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]">
                                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase">Team Name</p>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedRegistration.team_name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]">
                                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase">Category</p>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedRegistration.category || 'N/A'}</p>
                                        </div>
                                        <div className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)] col-span-2 md:col-span-1">
                                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase">Team Size</p>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedRegistration.team_size || 0} Members</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em]">Contact Person</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]">
                                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase">Name</p>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedRegistration.contact_name}</p>
                                        </div>
                                        <div className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]">
                                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase">Mobile</p>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedRegistration.phone}</p>
                                        </div>
                                        <div className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)] md:col-span-2">
                                            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase">Email Address</p>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{selectedRegistration.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedRegistration.players && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em]">Roster</h3>
                                        <div className="bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-border)] max-h-[200px] overflow-y-auto">
                                            <p className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
                                                {selectedRegistration.players}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-4 md:p-6 border-t border-[var(--color-border)] bg-[var(--color-background)]/50 flex flex-col md:flex-row gap-3">
                        <button
                            onClick={() => handleDelete(selectedRegistration.$id)}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold hover:bg-red-600 hover:text-white transition-all text-xs"
                        >
                            Delete Team
                        </button>
                        <button
                            onClick={closeModal}
                            className="md:flex-none px-8 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:bg-white transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
