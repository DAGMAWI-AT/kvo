import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from '../Home';
import App from '../../App';
import UserLayout from '../user/dashboard/UserLayout';
import Dashboard from '../user/dashboard/Dashboard';

const Routers = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
        ]
    },
    {
        path: "/user/dashboard",
        element: (
            <UserLayout />
        ),
        children: [
            {
                path: "/user/dashboard",
                element: <Dashboard />,
            },
        ]
    }
])
export default Routers;
