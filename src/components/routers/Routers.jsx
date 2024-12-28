import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import Home from '../home/Home';
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
import Users from '../admin/users/Users';
import Category from '../admin/reportCategory/Category';
import EditCategory from '../admin/reportCategory/EditCategory';
import AllCsoReports from '../admin/cso/allCsoReports/AllCsoReports';
import EditProfile from '../admin/profile/EditProfile';
import ViewProfile from '../admin/profile/ViewProfile';
import ChangePassowrd from '../admin/changePassword/ChangePassowrd';
import HeroContent from '../admin/webContent/heroContent/HeroContent';
import UpdateHeroContent from '../admin/webContent/heroContent/UpdateHeroContent';
import ViewHeroContent from '../admin/webContent/heroContent/ViewHeroContent';
import AddHeroContent from '../admin/webContent/heroContent/AddHeroContent';
import News from '../news/News';
import Abouts from '../about/Abouts';
import Meeting from '../admin/webContent/meeting/Meeting';
import AddMeeting from '../admin/webContent/meeting/AddMeeting';
import QuarterlyReport from '../admin/reports/quarterly/QuarterlyReport';
import EditMeeting from '../admin/webContent/meeting/EditMeeting';
import ViewMeeting from '../admin/webContent/meeting/ViewMeeting';
import Contact from '../contact/Contact';
import BlogDetails from '../news/BlogDetails';


const Routers = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/news",
                element: <News />,
            },
            {
                path: "/news/blogdetails/:id",
                element: <BlogDetails />,
            },
            {
                path: "/about",
                element: <Abouts />,
            },
            {
                path: "/contact",
                element: <Contact />,
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
                path: "/admin/yearly_Report/:id",
                element: <YearlyReport />,
            },
            {
                path: "/admin/quarterly_report/:id",
                element: <QuarterlyReport />,
            },
            {
                path: "/admin/users",
                element: <Users />,
            },
            {
                path: "/admin/report_category/category",
                element: <Category />,
            },
            {
                path: "/admin/report_category/edit_category",
                element: <EditCategory />,
            },
            {
                path: "/admin/report_category/all_cso_reports",
                element: <AllCsoReports />,
            },
            {
                path: "/admin/edit_profile",
                element: <EditProfile />,
            },
            {
                path: "/admin/view_profile",
                element: <ViewProfile />,
            },
            {
                path: "/admin/update_password",
                element: <ChangePassowrd />,
            },
            {
                path: "/admin/web_content/hero_content",
                element: <HeroContent />,
            },
            {
                path: "/admin/web_content/update_hero_content",
                element: <UpdateHeroContent />,
            },
            {
                path: "/admin/web_content/view_hero_content",
                element: <ViewHeroContent />,
            },
            {
                path: "/admin/web_content/add_hero_content",
                element: <AddHeroContent />,
            },
            {
                path: "/admin/web_content/meeting_content",
                element: <Meeting />,
            },
            {
                path: "/admin/web_content/add_meeting_content",
                element: <AddMeeting />,
            },
            {
                path: "/admin/web_content/update_meeting_content",
                element: <EditMeeting />,
            },
            {
                path: "/admin/web_content/view_meeting_content",
                element: <ViewMeeting />,
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
