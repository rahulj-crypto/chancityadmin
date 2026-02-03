import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import gsap from 'gsap';

/**
 * LoginPage Component
 * Login page with logo and light theme
 */
export default function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(logoRef.current, {
                y: -30,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            });

            gsap.from(formRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                delay: 0.2,
                ease: 'power3.out'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(credentials.username, credentials.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);

            if (formRef.current) {
                gsap.fromTo(formRef.current,
                    { x: -10 },
                    {
                        x: 10, duration: 0.1, repeat: 3, yoyo: true, ease: 'power1.inOut', onComplete: () => {
                            gsap.set(formRef.current, { x: 0 });
                        }
                    }
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4"
        >
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div ref={logoRef} className="text-center mb-8">
                    <img
                        src="/logo.jpg"
                        alt="Chancity Logo"
                        className="w-24 h-24 rounded-2xl mx-auto mb-6 object-cover shadow-lg"
                    />
                    <h1 className="text-4xl font-stylish text-gradient hover-gradient cursor-default transition-all duration-300 mb-2">
                        Chancity Admin
                    </h1>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-semibold">
                        Tournament Registration Management
                    </p>
                </div>

                {/* Login Form */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 shadow-xl"
                >
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                        Sign In
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-lg">
                            <p className="text-sm text-[var(--color-error)]">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
                        Default credentials: <span className="font-mono text-[var(--color-text-secondary)]">admin / 0000</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
