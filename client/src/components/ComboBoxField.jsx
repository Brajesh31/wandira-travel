import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../utils/util';

const ComboBoxField = ({
    label,
    options = [],
    placeholder = "Select an option...",
    onchange
}) => {
    const [value, setValue] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const comboboxRef = useRef(null);

    const getOptionText = (text) => {
        setValue(text);
        setIsOpen(false);
        onchange(text)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="w-full px-3 sm:px-5 md:px-7 py-1.5 bg-white rounded-lg">
            {label && (
                <div className='font-karla text-ligh-200 capitalize'>
                    {label}
                </div>
            )}
            <div
                ref={comboboxRef}
                className='bg-white w-full px-3 shadow-100 py-2 rounded-md relative'>
                <div
                    className="flex-between cursor-pointer"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <p className="font-karla capitalize text-sm text-ligh-200 font-semibold select-none">
                        {value || placeholder}
                    </p>
                    <span className={cn("text-dark-300 transition-transform duration-200", isOpen && "rotate-180")}>
                        <ChevronDown size={19} />
                    </span>
                </div>

                {isOpen && (
                    <div className={cn("w-full absolute left-0 top-full p-2 z-30 bg-white rounded-md shadow-400 opacity-0 h-48 overflow-y-auto", isOpen && "mt-1 opacity-100")}>
                        <ul className='space-y-1'>
                            {options.map((item, idx) => (
                                <li
                                    className={cn("px-3 w-full cursor-pointer py-1.5 hover:bg-slate-100 duration-2 rounded-sm text-dark-200 font-medium flex-center justify-between", item === value && "bg-primary-100 text-white hover:bg-primary-200")}
                                    key={idx}
                                    onClick={() => getOptionText(item)}
                                >
                                    <span>
                                        {item}
                                    </span>

                                    {value === item && (
                                        <span className="">
                                            <Check size={18} />
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComboBoxField
