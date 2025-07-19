import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className='mx-auto container my-6 border-t py-3 border-ligh-50 px-5'>
            <div className='flex flex-col items-start sm:flex-row sm:items-center justify-between w-full'>
                <Link
                    to="/"
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

                <div className="flex gap-5 text-sm text-gray-500 duration-2 mt-3 sm:mt-0">
                    <a href="#" className="hover:underline">
                        Terms & Condition
                    </a>
                    <a href="#" className="hover:underline">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer
