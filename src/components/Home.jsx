import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';

function Home() {
  return (
    <div>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />
                <Main />
            </div>
        </div>
    </div>
  );
}

export default Home;
