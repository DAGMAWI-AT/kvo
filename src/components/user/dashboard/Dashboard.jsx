import React from 'react';
import Bar from './circlebar/Bar';
import DashboardReport from './DashboardReport';

const Dashboard = ({ darkMode }) => {
  return (
    // <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
    <div>
            <p className="text-lg text-yellow-500 whitespace-nowrap">under Construction <i className="text-red-600">test</i> </p>

      {/* <h1 className="text-2xl font-bold mb-4 text-gray-300">Dashboard</h1> */}
      <Bar/>
      <DashboardReport/>
    </div>
  );
};

export default Dashboard;
