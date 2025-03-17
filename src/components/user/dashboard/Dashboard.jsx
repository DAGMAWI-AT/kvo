import React from 'react';
import Bar from './circlebar/Bar';

const Dashboard = ({ darkMode }) => {
  return (
    // <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-300">Dashboard</h1>
      <Bar darkMode={darkMode} />
    </div>
  );
};

export default Dashboard;
