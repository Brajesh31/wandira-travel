import React from 'react';
import { cn } from '../utils/util';

const Button = ({ title, classContainer, topClass, func, leftIcon, rightIcon, type = "button" }) => {
    
    return (
        <div className={cn("w-full relative border-none outline-none" ,topClass)}>
            <button
                type={type}
                className={cn(
                    "w-full px-5 py-2.5 cursor-pointer origin-left skew-0 overflow-hidden border-none outline-none group duration-2", classContainer
                )}
                onClick={func}
            >
                {leftIcon}

                <div className="overflow-hidden font-semibold relative inline-flex font-recursive text-xs uppercase">
                    <span className="translate-y-0 skew-y-0 transition-all duration-500 group-hover:translate-y-[-165%] group-hover:skew-y-12">
                        {title}
                    </span>
                    <span className="absolute translate-y-[165%] skew-y-12 transition-all duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                        {title}
                    </span>
                </div>
                {rightIcon}
            </button>
        </div>
    )
}

export default Button