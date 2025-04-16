// import { motion } from 'framer-motion';
// import { Users, Globe, Award, BarChart2 } from 'react-feather';

// const About = () => {
//   const stats = [
//     { value: '150+', label: 'Clients Worldwide', icon: <Globe className="w-8 h-8" /> },
//     { value: '12', label: 'Years Experience', icon: <Award className="w-8 h-8" /> },
//     { value: '95%', label: 'Client Retention', icon: <Users className="w-8 h-8" /> },
//     { value: '3x', label: 'Growth Potential', icon: <BarChart2 className="w-8 h-8" /> }
//   ];

//   const team = [
//     {
//       name: 'Sarah Johnson',
//       role: 'CEO & Founder',
//       bio: 'Digital transformation expert with 15+ years in tech leadership',
//       image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
//     },
//     {
//       name: 'Michael Chen',
//       role: 'CTO',
//       bio: 'Cloud architecture specialist and AI innovator',
//       image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
//     },
//     {
//       name: 'Elena Rodriguez',
//       role: 'Creative Director',
//       bio: 'Award-winning UX designer with a human-centered approach',
//       image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80'
//     }
//   ];

//   return (
//     <section id="about" className="py-20 bg-gray-50">
//       <div className="container mx-auto px-6">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             About <span className="text-indigo-600">BrightHop</span>
//           </h2>
//           <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             We're a team of innovators, strategists, and technologists dedicated to transforming businesses through digital excellence.
//           </p>
//         </motion.div>

//         {/* Company Story */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Story</h3>
//             <p className="text-gray-600 mb-4">
//               Founded in 2012, BrightHop began as a small digital consultancy in San Francisco. What started as three passionate technologists working from a garage has grown into an award-winning firm serving clients across four continents.
//             </p>
//             <p className="text-gray-600 mb-6">
//               We've maintained our startup mentality while building enterprise-level expertise, allowing us to deliver innovative solutions with personal attention.
//             </p>
//             <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//               Read Our Full Story
//             </button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="relative h-96 rounded-xl overflow-hidden shadow-xl"
//           >
//             <img 
//               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
//               alt="BrightHop team working together"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent flex items-end p-6">
//               <p className="text-white text-sm italic">
//                 "Our team collaborating at our San Francisco headquarters"
//               </p>
//             </div>
//           </motion.div>
//         </div>

//         {/* Stats */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
//         >
//           {stats.map((stat, index) => (
//             <div 
//               key={index}
//               className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
//             >
//               <div className="text-indigo-600 mb-3 flex justify-center">
//                 {stat.icon}
//               </div>
//               <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
//               <p className="text-gray-600">{stat.label}</p>
//             </div>
//           ))}
//         </motion.div>

//         {/* Leadership Team */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">Meet Our Leadership</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {team.map((member, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ y: -10 }}
//                 className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
//               >
//                 <div className="h-64 overflow-hidden">
//                   <img 
//                     src={member.image} 
//                     alt={member.name}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
//                   <p className="text-indigo-600 mb-3">{member.role}</p>
//                   <p className="text-gray-600">{member.bio}</p>
//                   <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
//                     View Profile →
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Values */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="mt-20 bg-white rounded-xl shadow-lg overflow-hidden"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3">
//             <div className="md:col-span-1 bg-indigo-600 p-8 text-white">
//               <h3 className="text-2xl font-bold mb-6">Our Core Values</h3>
//               <p className="mb-6">
//                 These principles guide every decision we make and every solution we deliver.
//               </p>
//               <button className="px-6 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-colors">
//                 Learn About Our Culture
//               </button>
//             </div>
//             <div className="md:col-span-2 p-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="flex items-start">
//                   <div className="bg-indigo-100 p-3 rounded-lg mr-4">
//                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-bold text-gray-900 mb-2">Innovation First</h4>
//                     <p className="text-gray-600">We challenge conventions to deliver breakthrough solutions.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-indigo-100 p-3 rounded-lg mr-4">
//                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-bold text-gray-900 mb-2">Integrity Always</h4>
//                     <p className="text-gray-600">We do what's right, even when no one is watching.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-indigo-100 p-3 rounded-lg mr-4">
//                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-bold text-gray-900 mb-2">Collaborative Spirit</h4>
//                     <p className="text-gray-600">We achieve more through partnership than individual effort.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="bg-indigo-100 p-3 rounded-lg mr-4">
//                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-bold text-gray-900 mb-2">Relentless Quality</h4>
//                     <p className="text-gray-600">We settle for nothing less than excellence in all we do.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default About;

import React from "react";
import "./About.css";

const Abouts = () => {
  return (
    <> <div class="page-title-area p-20"><h1 className="text-center text-2xl mt-20 text-gray-500 "> Under Construction</h1> </div></>
    // <>
    //   <div class="page-title-area p-20">
    //     <div class="d-table">
    //       <div class="d-table-cell">
    //         <div class="container">
    //           <h2>About Us</h2>
    //         </div>
    //       </div>
    //     </div>
    //     <div class="shape1">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="202"
    //         height="202"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape1.png"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape2 rotateme">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="22"
    //         height="22"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape2.svg"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape3">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="28"
    //         height="28"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape3.svg"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape4">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="21"
    //         height="20"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape4.svg"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape5">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="182"
    //         height="146"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape5.png"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape6 rotateme">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="21"
    //         height="20"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape4.svg"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape7">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="21"
    //         height="20"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape4.svg"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //     <div class="shape8 rotateme">
    //       <img
    //         alt="shape"
    //         loading="lazy"
    //         width="22"
    //         height="22"
    //         decoding="async"
    //         data-nimg="1"
    //         src="/shape2.svg"
    //         style={{ color: "transparent" }}
    //       />
    //     </div>
    //   </div>
    //   <div class="about-area pt-2 pb-20">
    //     <div class="container mx-auto">
    //       <div class="flex flex-wrap items-center">
    //         <div class="lg:w-1/2 w-full">
    //           <div class="about-image p-20">
    //             <img
    //               alt="image"
    //               loading="lazy"
    //               class="max-w-full h-auto"
    //               src="/contact-img.png"
    //             />
    //           </div>
    //         </div>
    //         <div class="lg:w-1/2 w-full mt-6 lg:mt-0">
    //           <div class="about-content">
    //             <div class="section-title">
    //               <h2 class="text-2xl font-bold mb-4">About Us</h2>
    //               <div class="bar"></div>
    //               {/* <div class="w-12 h-1 bg-gray-800 mb-4"></div> */}
    //               <p class=" mb-4">
    //                 Lorem ipsum dolor sit amet, con se ctetur adipiscing elit.
    //                 In sagittis eg esta ante, sed viverra nunc tinci dunt nec
    //                 elei fend et tiram.
    //               </p>
    //             </div>
    //             <p class="text-gray-600 mb-4">
    //               Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
    //               sagittis egestas ante, sed viverra nunc tincidunt nec nteger
    //               nonsed condimntum elit, sit amet feugiat lorem. Proin tempus
    //               sagittis velit vitae scelerisque.
    //             </p>
    //             <p class="text-gray-600 mb-4">
    //               Lorem ipsum dolor sit amet, con se ctetur adipiscing elit. In
    //               sagittis eg esta ante, sed viverra nunc tinci dunt nec elei
    //               fend et tiram.
    //             </p>
    //             <p class="text-gray-600">
    //               Business-to-business metrics analytics value proposition
    //               funding angel investor entrepreneur alpha ramen equity
    //               gamification. Social proof partner network research.
    //             </p>
    //           </div>
    //         </div>
    //       </div>

    //       <div class="about-inner-area mt-10">
    //         <div class="flex flex-wrap justify-center">
    //           <div class="lg:w-1/3 md:w-1/2 w-full p-4">
    //             <div class="about-text bg-gray-100 p-6 rounded-lg shadow">
    //               <h3 class="text-xl font-semibold mb-4">Our History</h3>
    //               <p class="text-gray-600">
    //                 Lorem ipsum dolor sit amet, con se ctetur adipiscing elit.
    //                 In sagittis eg esta ante, sed viverra nunc tinci dunt nec
    //                 elei fend et tiram.
    //               </p>
    //             </div>
    //           </div>
    //           <div class="lg:w-1/3 md:w-1/2 w-full p-4">
    //             <div class="about-text bg-gray-100 p-6 rounded-lg shadow">
    //               <h3 class="text-xl font-semibold mb-4">Our Mission</h3>
    //               <p class="text-gray-600">
    //                 Lorem ipsum dolor sit amet, con se ctetur adipiscing elit.
    //                 In sagittis eg esta ante, sed viverra nunc tinci dunt nec
    //                 elei fend et tiram.
    //               </p>
    //             </div>
    //           </div>
    //           <div class="lg:w-1/3 md:w-1/2 w-full p-4">
    //             <div class="about-text bg-gray-100 p-6 rounded-lg shadow">
    //               <h3 class="text-xl font-semibold mb-4">Who We Are</h3>
    //               <p class="text-gray-600">
    //                 Lorem ipsum dolor sit amet, con se ctetur adipiscing elit.
    //                 In sagittis eg esta ante, sed viverra nunc tinci dunt nec
    //                 elei fend et tiram.
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div class="container mx-auto mt-10">
    //     <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
    //       <div class="single-banner-boxes p-6 rounded-lg shadow hover:shadow-lg transition">
    //         <div class="icon text-gray-700 mb-4">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="24"
    //             height="24"
    //             viewBox="0 0 24 24"
    //             fill="none"
    //             stroke="currentColor"
    //             stroke-width="2"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //           >
    //             <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    //             <circle cx="9" cy="7" r="4"></circle>
    //             <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    //             <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    //           </svg>
    //         </div>
    //         <h3 class="text-lg font-semibold mb-2">Financial Planning</h3>
    //         <p class="text-gray-600">
    //           Develop and implement comprehensive financial strategies to ensure
    //           the organization's long-term financial stability and growth.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};

export default Abouts;
