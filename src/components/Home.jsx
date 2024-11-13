import React from 'react';
import Main from './Main';
import Hero from './Hero';

function Home() {
  return (
      <div style={{  minHeight: '100vh' }}>
          {/* <Sidebar /> */}
          <Hero/>
          <Main />
      </div>
  );
}

export default Home;
