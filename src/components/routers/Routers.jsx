import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home/Home";
import App from "../../App";
import UserLayout from "../user/userLayout/UserLayout";
import Dashboard from "../user/dashboard/Dashboard";
import Signin from "../user/auth/signin/Signin";
import SignUp from "../user/auth/signup/Signup";
import WorkReport from "../user/dashboard/reports/WorkReport";
import ViewWorkReport from "../user/dashboard/reports/ViewWorkReport";
import UploadReports from "../user/dashboard/reports/UploadReports";
import UpdateReports from "../user/dashboard/reports/UpdateReports";
//admin
import AdminLayout from "../admin/adminLayout/AdminLayout";
import AdminDashboard from "../admin/adminDashboard/AdminDashboard";
import Reports from "../admin/reportCategory/Reports";
import ExpireDate from "../admin/expireDate/ExpireDate";
import Csos from "../admin/cso/Csos";
import EachCso from "../admin/cso/each/EachCso";
import YearlyReport from "../admin/reports/yearly/YearlyReport";
import Users from "../admin/users/Users";
import Category from "../admin/reportCategory/Category";
import EditCategory from "../admin/reportCategory/EditCategory";
import AllCsoReports from "../admin/cso/allCsoReports/AllCsoReports";
import EditProfile from "../admin/profile/EditProfile";
import ViewProfile from "../admin/profile/ViewProfile";
import ChangePassowrd from "../admin/changePassword/ChangePassowrd";
import HeroContent from "../admin/webContent/heroContent/HeroContent";
import UpdateHeroContent from "../admin/webContent/heroContent/UpdateHeroContent";
import ViewHeroContent from "../admin/webContent/heroContent/ViewHeroContent";
import AddHeroContent from "../admin/webContent/heroContent/AddHeroContent";
import News from "../news/News";
import Abouts from "../about/Abouts";
import Meeting from "../admin/webContent/meeting/Meeting";
import AddMeeting from "../admin/webContent/meeting/AddMeeting";
import QuarterlyReport from "../admin/reports/quarterly/QuarterlyReport";
import EditMeeting from "../admin/webContent/meeting/EditMeeting";
import ViewMeeting from "../admin/webContent/meeting/ViewMeeting";
import Contact from "../contact/Contact";
import BlogDetails from "../news/BlogDetails";
import Service from "../service/Service";
import CsoRegister from "../admin/csoRegister/CsoRegister";
import CreateAccount from "../admin/createAccount/CreateAccount";
import PrivateRoute from "../privateRoute/PrivateRoute ";
import EditUserProfile from "../user/profile/EditUserProfile";
import ViewUserProfile from "../user/profile/ViewUserProfile";

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
        path: "/service",
        element: <Service />,
      },
      {
        path: "/about",
        element: <Abouts />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  //User Dashboard
  {
    path: "/user",
    element: <PrivateRoute element={<UserLayout />} roleRequired="cso" />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "/user/dashboard/work_report",
        element: <WorkReport />,
      },
      {
        path: "/user/dashboard/work_report/viewworkreport/:id",
        element: <ViewWorkReport />,
        loader: async ({ params }) =>
          fetch(`http://localhost:8000/getUserReport/${params.id}`).then(
            (res) => res.json()
          ),
      },
      {
        path: "/user/dashboard/upload_report",
        element: <UploadReports />,
      },
      {
        path: "/user/dashboard/update_report/:id",
        element: <UpdateReports />,
      },
      {
        path: "Edit_user_prifile",
        element: <EditUserProfile />,
      },
      {
        path: "view_user_prifile",
        element: <ViewUserProfile />,
      },
    ],
  },
  // admin dashboard
  {
    path: "/admin",
      // <PrivateRoute><AdminLayout /></PrivateRoute>
      element: <PrivateRoute roleRequired="admin" element={<AdminLayout />} />,
    
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "report_category",
        element: <Reports />,
      },
      {
        path: "expire_date",
        element: <ExpireDate />,
      },
      {
        path: "all_cso",
        element: <Csos />,
      },
      {
        path: "each_cso/:id",
        element: <EachCso />,
      },
      {
        path: "yearly_Report/:id",
        element: <YearlyReport />,
      },
      {
        path: "quarterly_report/:id",
        element: <QuarterlyReport />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "report_category/category",
        element: <Category />,
      },
      {
        path: "report_category/edit_category",
        element: <EditCategory />,
      },
      {
        path: "report_category/all_cso_reports",
        element: <AllCsoReports />,
      },
      {
        path: "edit_profile",
        element: <EditProfile />,
      },
      {
        path: "view_profile",
        element: <ViewProfile />,
      },
      {
        path: "update_password",
        element: <ChangePassowrd />,
      },
      {
        path: "web_content/hero_content",
        element: <HeroContent />,
      },
      {
        path: "web_content/update_hero_content",
        element: <UpdateHeroContent />,
      },
      {
        path: "web_content/view_hero_content",
        element: <ViewHeroContent />,
      },
      {
        path: "web_content/add_hero_content",
        element: <AddHeroContent />,
      },
      {
        path: "web_content/meeting_content",
        element: <Meeting />,
      },
      {
        path: "web_content/add_meeting_content",
        element: <AddMeeting />,
      },
      {
        path: "web_content/update_meeting_content",
        element: <EditMeeting />,
      },
      {
        path: "web_content/view_meeting_content",
        element: <ViewMeeting />,
      },
      {
        path: "user_register",
        element: <CsoRegister />,
      },

      {
        path: "create_userAccount",
        element: <CreateAccount />,
      },
    ],
  },
  //login rout
  {
    path: "/user/login",
    element: <Signin />,
  },
  // //register rout
  // {
  //     path: "/user/register",
  //     element: <SignUp />,
  // },
]);
export default Routers;
