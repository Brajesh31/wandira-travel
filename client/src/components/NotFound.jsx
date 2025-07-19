import React from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/shared/Auth';


const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  const checkRole = () => {
    if (!role || !user || role !== "admin") {
      return false
    }
    return true
  }

  return (
    <div class="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-karla">
      <div class="max-w-md w-full space-y-8 text-center">
        <div class="mb-8">
          <h2 class="mt-6 text-6xl font-extrabold text-dark-100">404</h2>
          <p class="mt-1 text-3xl font-bold text-dark-100 special">Page not found</p>
          <p class="mt-2 text-sm text-ligh-200 special">Sorry, we couldn't find "{location.pathname}" page that you're looking for.</p>
        </div>
        <div class="mt-2">
          <Link to={`${checkRole !== "admin" ? "/" : "/admin"}`}
            class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-200 hover:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-primary-300">
            <svg class="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18m-9-9l9 9-9 9" />
            </svg>
            {checkRole ? "Go back home" : "Go back dashboard"}
          </Link>
        </div>
      </div>
      <div class="mt-3 w-full max-w-2xl">
        <div class="relative">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300 "></div>
          </div>
          <div class="relative flex justify-center">
            <span class="px-2 bg-gray-100  text-sm text-ligh-200 special text-center">
              If you think this is a mistake, please contact support
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound