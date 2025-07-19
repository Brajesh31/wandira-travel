import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';

import router from './routes';
import { AuthProvider, useAuth } from './contexts/shared/Auth';
import Loading from './components/loaders/Loading';
import useAxios from './utils/useAxios';
import { USER_API } from './apis/api';

const AppContent = () => {
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }
    const handleLoading = () => {
      setLoading(false);
    };

    window.addEventListener("load", handleLoading);
    return () => {
      window.removeEventListener("load", handleLoading);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(USER_API);
        login(response.data.data)
        return
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <RouterProvider router={router} />
  )
}

const App = () => {

  return (
    <div className="w-screen min-h-dvh bg-light-100 overflow-x-hidden">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
};

export default App;

