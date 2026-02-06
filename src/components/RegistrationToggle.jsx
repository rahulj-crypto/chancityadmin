import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';

export default function RegistrationToggle({ onStatusChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    adminApi.getSettings()
      .then(settings => setIsOpen(settings.registration_open))
      .catch(() => setIsOpen(true))
      .finally(() => setIsLoading(false));
  }, []);

  const handleConfirm = async () => {
    try {
      const newStatus = !isOpen;
      await adminApi.updateSettings({ registration_open: newStatus });
      setIsOpen(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
    setShowConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
        <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <h4 className="font-medium">Registration Status</h4>
              <p className="text-sm text-[var(--color-text-muted)]">{isOpen ? 'Open' : 'Closed'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className={`px-4 py-2 rounded-lg font-medium text-white ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isOpen ? 'Close' : 'Open'}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">{isOpen ? 'Close Registration?' : 'Open Registration?'}</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to {isOpen ? 'close' : 'open'} registrations?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
