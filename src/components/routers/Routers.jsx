import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import Home from '../Home';
import App from '../../App';
import UserLayout from '../user/userLayout/UserLayout';
import Dashboard from '../user/dashboard/Dashboard';
import Signin from '../user/auth/signin/Signin';
import SignUp from '../user/auth/signup/Signup';
import WorkReport from '../user/dashboard/reports/WorkReport';
import ViewWorkReport from '../user/dashboard/reports/ViewWorkReport';
import UploadReports from '../user/dashboard/reports/UploadReports';
import UpdateReports from '../user/dashboard/reports/UpdateReports';
//admin
import AdminLayout from '../admin/adminLayout/AdminLayout';
import AdminDashboard from '../admin/adminDashboard/AdminDashboard';
import Reports from '../admin/reportCategory/Reports';
import ExpireDate from '../admin/expireDate/ExpireDate';
import Csos from '../admin/cso/Csos';
import EachCso from '../admin/cso/each/EachCso';
import YearlyReport from '../admin/reports/yearly/YearlyReport';


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
    //User Dashboard
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
            {
                path: "/user/dashboard/work_report",
                element: <WorkReport />,
            },
            {
                path: "/user/dashboard/work_report/viewworkreport/:id",
                element: <ViewWorkReport />,
            },
            {
                path: "/user/dashboard/upload_report",
                element: <UploadReports />,
            },
            {
                path: "/user/dashboard/update_report/:id",
                element: <UpdateReports />,
            },
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminLayout />
        ),
        children: [
            {
                path: "/admin/dashboard",
                element: <AdminDashboard />,
            },
            {
                path: "/admin/report_category",
                element: <Reports />,
            },
            {
                path: "/admin/expire_date",
                element: <ExpireDate />,
            },
            {
                path: "/admin/all_cso",
                element: <Csos />,
            },
            {
                path: "/admin/each_cso/:id",
                element: <EachCso />,
            },
            {
                path: "/admin/yearlyReport/:id",
                element: <YearlyReport />,
            },
           
        ]
    },
    //login rout
    {
        path: "/user/login",
        element: <Signin />,
    },
    //register rout
    {
        path: "/user/register",
        element: <SignUp />,
    },
])
export default Routers;
