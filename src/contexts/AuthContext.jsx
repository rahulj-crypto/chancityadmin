import { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * Authentication Context for Admin Panel
 * Manages login state with simple local authentication
 */

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}

// Admin credentials (hardcoded as per requirements)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '0000'
};

const SESSION_KEY = 'chancity_admin_session';

// Create context
const AuthContext = createContext(undefined);

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                const savedSession = localStorage.getItem(SESSION_KEY);
                if (savedSession) {
                    const session = JSON.parse(savedSession);
                    // Check if session is still valid (24 hour expiry)
                    if (session.expiresAt > Date.now()) {
                        dispatch({
                            type: AUTH_ACTIONS.LOGIN_SUCCESS,
                            payload: session.user
                        });
                    } else {
                        // Session expired
                        localStorage.removeItem(SESSION_KEY);
                        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                    }
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Error checking session:', error);
                localStorage.removeItem(SESSION_KEY);
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        checkSession();
    }, []);

    /**
     * Login function
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     * @returns {Promise<boolean>} - Success status
     */
    const login = async (username, password) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Validate credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            const user = {
                username: 'admin',
                role: 'administrator',
                loginTime: new Date().toISOString()
            };

            // Save session to localStorage (24 hour expiry)
            const session = {
                user,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000)
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: user
            });

            return true;
        } else {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: 'Invalid username or password'
            });
            return false;
        }
    };

    /**
     * Logout function
     * Clears session and redirects to login
     */
    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    /**
     * Clear error message
     */
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    const value = {
        ...state,
        login,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth Hook
 * Access authentication context in components
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
