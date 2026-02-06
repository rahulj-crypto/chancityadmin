import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getRegistrations({ search, limit: 100 });
        let results = data.data || [];
        
        // Client-side category filter
        if (category) {
          results = results.filter(r => r.category?.toLowerCase() === category.toLowerCase());
        }
        
        setRegistrations(results);
      } catch (err) {
        console.error('API error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [search, category]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    try {
      await adminApi.deleteRegistration(id);
      setRegistrations(prev => prev.filter(r => r.$id !== id));
      setSelectedRegistration(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search team or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] focus:outline-none min-w-[140px]"
          >
            <option value="">All Categories</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <th className="px-4 py-4 text-left font-semibold uppercase text-xs">Team</th>
                  <th className="px-4 py-4 text-left font-semibold uppercase text-xs">Category</th>
                  <th className="px-4 py-4 text-left font-semibold uppercase text-xs">Contact</th>
                  <th className="px-4 py-4 text-left font-semibold uppercase text-xs">Date</th>
                  <th className="px-4 py-4 text-center font-semibold uppercase text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-16 text-center text-[var(--color-text-muted)]">No registrations found</td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.$id} className="hover:bg-[var(--color-background)] cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      <td className="px-4 py-4 font-medium">{reg.team_name || 'N/A'}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${reg.category?.toLowerCase() === 'senior' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                          {reg.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">{reg.contact_name}</td>
                      <td className="px-4 py-4">{formatDate(reg.$createdAt)}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedRegistration(reg); }} className="px-3 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border)] text-xs hover:bg-[var(--color-primary)] hover:text-white">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedRegistration(null)}>
          <div className="max-w-2xl w-full bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold">Registration Details</h2>
              <button onClick={() => setSelectedRegistration(null)} className="p-2 hover:bg-[var(--color-background)] rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-background)] rounded-lg p-3 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase">Team Name</p>
                  <p className="font-bold">{selectedRegistration.team_name || 'N/A'}</p>
                </div>
                <div className="bg-[var(--color-background)] rounded-lg p-3 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase">Category</p>
                  <p className="font-bold">{selectedRegistration.category || 'N/A'}</p>
                </div>
                <div className="bg-[var(--color-background)] rounded-lg p-3 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase">Team Size</p>
                  <p className="font-bold">{selectedRegistration.team_size || 0} Members</p>
                </div>
                <div className="bg-[var(--color-background)] rounded-lg p-3 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase">Contact</p>
                  <p className="font-bold">{selectedRegistration.contact_name}</p>
                </div>
              </div>
              
              <div className="bg-[var(--color-background)] rounded-lg p-4 border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] uppercase mb-1">Phone</p>
                <p className="font-bold">{selectedRegistration.phone}</p>
              </div>
              
              {selectedRegistration.email && (
                <div className="bg-[var(--color-background)] rounded-lg p-4 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase mb-1">Email</p>
                  <p className="font-bold">{selectedRegistration.email}</p>
                </div>
              )}
              
              {selectedRegistration.players && (
                <div className="bg-[var(--color-background)] rounded-lg p-4 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase mb-1">Players</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRegistration.players}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--color-border)] flex gap-3">
              <button
                onClick={() => handleDelete(selectedRegistration.$id)}
                className="flex-1 px-4 py-3 rounded-lg bg-red-50 text-red-600 border border-red-100 font-bold hover:bg-red-600 hover:text-white transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="px-8 py-3 rounded-lg border border-[var(--color-border)] font-bold hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
