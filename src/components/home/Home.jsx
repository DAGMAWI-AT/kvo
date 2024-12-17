import React, { useState } from 'react';
import Main from './Main';
import Hero from './hero/Hero';
import What_We_Do from './what_we_do/What_We_Do';
import WhoWeAre from './who_we_are/Who_we_are';



function Home() {

  
  return (
      <div style={{  minHeight: '100vh' }}>
          {/* <Sidebar /> */}
          <Hero/>
          <WhoWeAre/>
          <What_We_Do/>
          {/* <Main /> */}
      </div>
  );
}

export default Home;
