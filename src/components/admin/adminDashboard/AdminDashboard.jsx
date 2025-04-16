// import React from 'react'
// import CircleBar from './CircleBar'

// const Dashboard = () => {
//   return (
//     <div>
//       <CircleBar/>
//     </div>
//   )
// }

// export default Dashboard









import React, { useEffect, useState } from "react";
import CircleBar from "./CircleBar";
import axios from "axios";
import DashboardReport from "./DashboardReport";
import { useNavigate } from "react-router";

const Dashboard = () => {
 const navigate = useNavigate()
  const fetchUsers = async () => {
    try {
      const meResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/staff/me`, {
        withCredentials: true,
      });

      if (!meResponse.data || !meResponse.data.success) {
        navigate("/login");
        return;
      }

      if (!meResponse.data || !meResponse.data.success || !meResponse.data?.success) {
        navigate("/login");
        return;
      }

    } catch (err) {
      
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <div>
      <p className="text-lg text-yellow-500 whitespace-nowrap">under Construction <i className="text-red-600">test</i> </p>
      <CircleBar/>
      <DashboardReport/>
    </div>
  );
};

export default Dashboard;