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

const Dashboard = () => {
  const [data, setData] = useState({
    usersPercentage: 0,
    usersCount: 0,
    csoPercentage: 0,
    csoCount: 0,
    // proposalsPercentage: 0,
    // proposalsCount: 0,
    reportsPercentage: 0,
    reportsCount: 0,
    projectsPercentage: 0,
    projectsCount: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/res/dashboard");
        setData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <CircleBar
        usersPercentage={data.usersPercentage}
        usersCount={data.usersCount}
        csoPercentage={data.csoPercentage}
        csoCount={data.csoCount}
        // proposalsPercentage={data.proposalsPercentage}
        // proposalsCount={data.proposalsCount}
        reportsPercentage={data.reportsPercentage}
        reportsCount={data.reportsCount}
        projectsPercentage={data.projectsPercentage}
        projectsCount={data.projectsCount}
      />
    </div>
  );
};

export default Dashboard;