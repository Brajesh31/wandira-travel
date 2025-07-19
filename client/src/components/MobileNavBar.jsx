import React from 'react'
import { cn } from '../utils/util'
import { Link } from 'react-router'
import { Menu } from 'lucide-react';
import { useInterface } from '../contexts/admin/InterfaceContext';

const MobileNavBar = () => {
    const { setSidebar } = useInterface();

    const toggleSidebar = () => {
        setSidebar((prev) => !prev);
    }
    return (
        <div className={cn("p-4 px-5 shadow-100 sm:px-8 w-full md:hidden")}>
            <div className="w-full flex-between">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 select-none"
                >
                    <img
                        src="/assets/images/logo.svg"
                        alt="logo"
                        width={29}
                    />
                    <span className="main-gradient text-[21px] capitalize special">
                        wandira
                    </span>
                </Link>

                <div className="flex-center gap-1.5">
                    <button
                        className='text-shadow-dark-200 hover:text-dark-100 cursor-pointer duration-2 size-8 grid place-items-center hover:bg-ligh-50 rounded-md'
                        onClick={toggleSidebar} >
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MobileNavBar