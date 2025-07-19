import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { sidebarIcon } from '../constants/links';
import { cn } from "../utils/util";
import { useAuth } from '../contexts/shared/Auth';
import { LogOut } from 'lucide-react';
import { useInterface } from '../contexts/admin/InterfaceContext';


const SideBar = ({ confrimBox }) => {
  const { user } = useAuth();
  const sideBarRef = useRef(null);
  const { sideBar, setSidebar } = useInterface();

  useEffect(() => {
    const handleClickOut = (e) => {
      if (sideBar && sideBarRef.current && !sideBarRef.current.contains(e.target)) {
        setSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOut);

    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    }
  }, [sideBar])

  useEffect(() => {
    const mediaChange = window.matchMedia("(max-width :769px)");

    const handleChange = (e) => {
      setSidebar(false)
    };

    mediaChange.addEventListener("change", handleChange);
    return () => {
      mediaChange.removeEventListener("change", handleChange);
    }
  }, []);

  return (
    <aside
      ref={sideBarRef}
      className='h-full w-64 md:w-52 lg:w-64 bg-white duration-2 flex flex-col justify-between'
    >
      <div className="p-3 border-b border-ligh-50">
        <Link
          to="/admin/dashboard"
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

      <div className="flex flex-col justify-between h-full">
        <div className="mt-5">
          <ul className='grid gap-1 px-3'>
            {sidebarIcon.map((link) => (
              <li
                key={link.id}
              >
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    cn("text-dark-100 flex-center gap-1.5 px-3 font-karla font-semibold text-base py-2 hover:bg-ligh-100 active:bg-ligh-100 rounded-lg duration-2",
                      {
                        "bg-primary-200! text-white!": isActive
                      }
                    )
                  }
                  onClick={() => setSidebar(false)}
                >
                  {<link.icon size={19} />}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {user && (
          <div className="p-3">
            <div className="flex-between duration-2 hover:bg-ligh-100 p-1 px-2 rounded-lg">
              <div className="flex-center">
                {<img
                  src={user.image || '/assets/images/dummy.jpg'}
                  alt={user ? user.name : "user"}
                  className='size-9 rounded-full object-cover object-center'
                />}
                <div className="ml-2">
                  <h4 className='font-semibold text-dark-200 text-base'>
                    {user?.name}
                  </h4>
                  <p className="text-ligh-200 text-xs font-karla">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                className='text-primary-300 hover:text-primary-200 cursor-pointer size-8 grid place-items-center rounded-full'
                onClick={() => confrimBox(true)}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideBar