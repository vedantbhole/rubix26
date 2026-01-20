import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout, setLoading } from '../store/authSlice';

const API_URL = 'http://localhost:5001/api';

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            dispatch(setLoading(true));

            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    method: 'GET',
                    credentials: 'include', // This sends the httpOnly cookie
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        // User is authenticated, update Redux state with user data
                        dispatch(login(data.data));
                    } else {
                        // Token is invalid, clear auth state
                        dispatch(logout());
                    }
                } else {
                    // Not authenticated or token expired
                    dispatch(logout());
                }
            } catch (error) {
                console.error('Auth verification error:', error);
                // On error, clear auth state
                dispatch(logout());
            } finally {
                dispatch(setLoading(false));
                setIsInitialized(true);
            }
        };

        verifyAuth();
    }, [dispatch]);

    // Optionally show a loading state while checking auth
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-herb-500/30 border-t-herb-500 rounded-full animate-spin" />
            </div>
        );
    }

    return children;
}
