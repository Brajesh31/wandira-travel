import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import SideBar from '../components/SideBar';
import { cn } from '../utils/util';
import { useInterface } from '../contexts/admin/InterfaceContext';
import { useAuth } from '../contexts/shared/Auth';
import NotFound from '../components/NotFound';
import MobileNavBar from '../components/MobileNavBar';
import ConfirmBox from '../components/ConfirmBox';
import useAxios from '../utils/useAxios';
import { LOG_OUT } from '../apis/api';
import { CircleX } from 'lucide-react';

const AdminLayout = () => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const { sideBar } = useInterface();
    const { user, authed, logout } = useAuth();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [logoutMess, setlogoutMess] = useState(false)
    const [start, setStart] = useState(false);

    useEffect(() => {
        if (authed) return;

        if (!user) {
            navigate("/auth/login", { replace: true });
            return;
        }
    }, [user, authed, navigate]);
    const handleLogout = async () => {
        setStart(true);
        try {
            const response = await axiosInstance.post(LOG_OUT);
            if (response.data.stateCode) {
                logout();
                navigate("/auth/login", { replace: true })
            }
        } catch (error) {
            console.error(error);
            setlogoutMess(true);
        } finally {
            setOpenConfirm(false);
            setStart(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setlogoutMess(false);
        }, 1500)

        return () => clearTimeout(timer)
    }, [logoutMess])

    if (authed) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    if (user?.role !== "admin") {
        return <NotFound />
    }

    return (
        <div className='w-full min-h-dvh overflow-x-hidden'>
            {openConfirm && (
                <div className="w-full h-full fixed top-0 left-0 z-40">
                    <ConfirmBox
                        title="Log out"
                        description="Are you sure you want to log out? You won't lose any data by logging out."
                        cancelation={setOpenConfirm}
                        confrim={handleLogout}
                        start={start}
                    />
                </div>
            )}
            {logoutMess && (
                <div className="p-5 w-full md:w-fit absolute top-0 bg-gray-900 flex-center justify-center duration-3 z-[999] animated px-10 md:rounded-lg left-1/2 -translate-x-1/2">
                    <div className="flex-center">
                        <div className="size-8 rounded-full grid place-items-center aspect-square bg-red-300 text-red-100">
                            <CircleX />
                        </div>
                        <p className="ml-2 font-recursive text-white text-sm md:text-base">
                            Something went wrong! ,please try again.
                        </p>
                    </div>
                </div>
            )}
            <div className={cn(
                "w-52 lg:w-64 h-full fixed top-0 z-50 shadow-100 md:left-0 -left-full bg-black/60 duration-2",
                sideBar ? "left-0 w-full" : ""
            )}>
                <SideBar
                    confrimBox={setOpenConfirm}
                />
            </div>

            <main className="md:ml-52 lg:ml-64 duration-2 bg-ligh-100">
                <MobileNavBar />
                <main className='min-h-screen w-full !overflow-x-hidden overflow-y-auto'>
                    <Outlet />
                </main>
            </main>
        </div>
    )
}

export default AdminLayout