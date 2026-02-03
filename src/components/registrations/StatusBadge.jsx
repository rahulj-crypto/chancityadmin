/**
 * StatusBadge Component
 * Colored badge indicating registration status
 */
export default function StatusBadge({ status }) {
    const statusStyles = {
        pending: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30'
    };

    const style = statusStyles[status] || statusStyles.pending;
    const displayStatus = status || 'pending';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
        </span>
    );
}
