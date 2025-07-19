import React from 'react';
import { Link, Outlet ,Navigate } from 'react-router'
import { useAuth } from '../contexts/shared/Auth';
import NotFound from '../components/NotFound';


const AuthLayout = () => {
    const { authoed ,user ,token } = useAuth();

    // If user is authenticated, redirect to appropriate page
    if (authoed && user) {
        const targetPath = user.role === "admin" ? '/admin' : '/';
        return <Navigate to={targetPath} replace />;
    }

    return (
        <section className='min-h-dvh w-screen flex before:absolute before:bg-auth before:h-full before:w-full before:bg-no-repeat before:left-0 before:top-0 before:bg-cover'>
            <div className="w-full min-h-full relative">
                <div className="absolute top-5 left-5">
                    <Link
                        to="/"
                        className="flex items-center gap-1.5 py-0.5 select-none"
                    >
                        <img
                            src="/assets/images/logo.svg"
                            alt="logo"
                            width={32}
                        />
                        <span className="main-gradient text-2xl md:text-3xl capitalize font-recursive">
                            wandira
                        </span>
                    </Link>
                </div>
                <div className="center h-full p-5">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default AuthLayout