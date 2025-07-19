import { createBrowserRouter } from 'react-router';

import UserLayout from '../layout/UserLayout';
import AdminLayout from '../layout/AdminLayout';
import Home from '../pages/user/Home';
import Dashboard from '../pages/admin/Dashboard';
import Trips from '../pages/admin/Trips';
import TripDetails from '../pages/admin/TripDetails';
import NotFound from '../components/NotFound';
import Travels from '../pages/user/Travels';
import TravelDetails from '../pages/user/TravelDetails';
import CreatTrip from '../pages/admin/CreatTrip';
import AllUsers from '../pages/admin/AllUsers';
import AdminProvider from '../contexts/admin/AdminProvider';
import AuthLayout from '../layout/AuthLayout';
import Sign from '../pages/auth/Sign';
import Login from '../pages/auth/Login';

const router = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { index: true, element: <Sign /> },
            { path: "sign-in", element: <Sign /> },
            { path: "login", element: <Login /> },
        ]
    },
    {
        path: '/',
        element: <UserLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'home', element: <Home /> },
            { path: 'travels', element: <Travels /> },
            { path: 'travels/:travelId', element: <TravelDetails /> }
        ]
    },
    {
        path: 'admin',
        element: <AdminProvider>
            <AdminLayout />
        </AdminProvider>,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'create-trip', element: <CreatTrip /> },
            { path: 'trips', element: <Trips /> },
            { path: 'trips/:tripId', element: <TripDetails /> },
            { path: 'all-users', element: <AllUsers /> }
        ]
    },
    { path: '*', element: <NotFound /> }
]);


export default router
