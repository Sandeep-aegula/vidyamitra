"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // List of public routes
        const publicPaths = ['/login', '/signup', '/forgot-password', '/', '/dashboard'];
        // Wait, user said "only access dashboardpage" if not logins. 
        // In our app, / is home and /dashboard is user personal dashboard.
        // Let's assume / is the public "dashboard" the user referred to.

        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isPublicPath = publicPaths.includes(pathname);
            const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);

            if (!token && !isPublicPath) {
                setAuthorized(false);
                router.push('/login');
            } else if (token && isAuthPage) {
                router.push('/dashboard');
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();

        // Optional: Re-check on every path change
    }, [pathname, router]);

    if (!authorized && !['/login', '/signup', '/forgot-password', '/', '/dashboard'].includes(pathname)) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D8AA8]"></div>
            </div>
        );
    }

    return children;
}
