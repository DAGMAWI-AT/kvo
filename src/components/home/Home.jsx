// Home.js
import React from "react";
import Hero from "./hero/Hero";
import WhatWeDo from "./what_we_do/What_We_Do";
import WhoWeAre from "./who_we_are/Who_we_are";
import HomeNewsPreview from "../news/HomeNewsPreview"
import ScrollToTop from '../scrollToTop/ScrollToTop';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <ScrollToTop/>
      <Hero />
      <WhoWeAre />
      {/* <WhatWeDo /> */}
      <HomeNewsPreview />
    </div>
  );
};

export default Home;

// pages/Home.jsx
// import React from 'react';
// import Hero from '../components/Hero';
// import ServicesPreview from '../components/ServicesPreview';
// import Stats from '../components/Stats';
// import Testimonials from '../components/Testimonials';
// import CTA from '../components/CTA';

// const Home = () => {
//   return (
//     <div className="pt-20">
//       <Hero />
//       <ServicesPreview />
//       <Stats />
//       <Testimonials />
//       <CTA />
//     </div>
//   );
// };

// export default Home;