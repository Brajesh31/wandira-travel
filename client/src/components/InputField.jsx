import React, { useState, useRef } from 'react'
import { EyeOff, Eye } from "lucide-react";
import { cn } from '../utils/util'

const InputField = ({ title, placeholder,value ,onchange ,type = "text" }) => {
  const [focused, setFocused] = useState(false);
  const [showPwd, setshowPwd] = useState(false);
  const inputRef = useRef(null);
  const isPassword = type === "password";
  const inputType = isPassword && showPwd ? "text" : type;

  const toggleIcon = () => {
    setshowPwd((prev) => !prev);
  }

  return (
    <div className="w-full relative flex flex-col gap-1">
      <label
        // htmlFor={title.toLowerCase().replace(/\s+/g, "-")}
        className="text-[15px] capitalize font-semibold text-dark-200 font-recursive px-1 w-fit"
      >
        {title}:
      </label>
      <div
        className={cn("flex-center border rounded-md border-ligh-200", focused && "ring-2 ring-primary-200 text-base text-dark-200")}
      >
        <input
          type={inputType}
          placeholder={placeholder}
          className="w-full px-2 py-1 outline-none font-karla"
          ref={inputRef}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          onChange={(e) => onchange(e.target.value)}
        />

        {type === "password" && (
          <span
            className='p-1.5 rounded-full text-primary-400 hover:text-primary-200 duration-2 cursor-pointer hover:bg-ligh-100 '
            onClick={toggleIcon}
          >
            {showPwd ? <Eye size={19} /> : <EyeOff size={19} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField