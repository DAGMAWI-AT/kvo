// import { motion } from 'framer-motion';
// import { Code, Cloud, Database, Smartphone, Server, BarChart2, Shield } from 'react-feather';

// const Services = () => {
//   const services = [
//     {
//       icon: <Code className="w-8 h-8 text-indigo-600" />,
//       title: "Custom Software Development",
//       description: "Tailored solutions designed to meet your unique business requirements with scalable architecture.",
//       highlights: [
//         "Web & mobile applications",
//         "API development & integration",
//         "Legacy system modernization"
//       ]
//     },
//     {
//       icon: <Cloud className="w-8 h-8 text-indigo-600" />,
//       title: "Cloud Solutions",
//       description: "End-to-end cloud services from migration to optimization across all major platforms.",
//       highlights: [
//         "AWS/Azure/GCP architecture",
//         "Serverless solutions",
//         "Hybrid cloud deployments"
//       ]
//     },
//     {
//       icon: <Database className="w-8 h-8 text-indigo-600" />,
//       title: "Data Analytics & AI",
//       description: "Transform raw data into actionable insights with cutting-edge analytics and machine learning.",
//       highlights: [
//         "Business intelligence dashboards",
//         "Predictive analytics",
//         "Natural language processing"
//       ]
//     },
//     {
//       icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
//       title: "UX/UI Design",
//       description: "Human-centered design that delights users and drives engagement.",
//       highlights: [
//         "User research & testing",
//         "Interactive prototyping",
//         "Design systems"
//       ]
//     },
//     {
//       icon: <Server className="w-8 h-8 text-indigo-600" />,
//       title: "DevOps & Infrastructure",
//       description: "Automated deployment pipelines and robust infrastructure management.",
//       highlights: [
//         "CI/CD implementation",
//         "Container orchestration",
//         "Infrastructure as code"
//       ]
//     },
//     {
//       icon: <Shield className="w-8 h-8 text-indigo-600" />,
//       title: "Cybersecurity",
//       description: "Comprehensive protection for your digital assets and infrastructure.",
//       highlights: [
//         "Risk assessments",
//         "Penetration testing",
//         "Compliance management"
//       ]
//     }
//   ];

//   const process = [
//     {
//       step: "01",
//       title: "Discovery",
//       description: "We analyze your needs and define project scope"
//     },
//     {
//       step: "02",
//       title: "Planning",
//       description: "Roadmap creation with milestones and deliverables"
//     },
//     {
//       step: "03",
//       title: "Design",
//       description: "Wireframing and prototyping key solutions"
//     },
//     {
//       step: "04",
//       title: "Development",
//       description: "Agile implementation with continuous feedback"
//     },
//     {
//       step: "05",
//       title: "Testing",
//       description: "Quality assurance and performance optimization"
//     },
//     {
//       step: "06",
//       title: "Launch & Support",
//       description: "Deployment and ongoing maintenance"
//     }
//   ];

//   return (
//     <section id="services" className="py-20 bg-white">
//       <div className="container mx-auto px-6">
//         {/* Hero Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-center mb-20"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Our <span className="text-indigo-600">Services</span>
//           </h1>
//           <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Comprehensive digital solutions tailored to your business objectives and growth targets.
//           </p>
//         </motion.div>

//         {/* Services Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
//           {services.map((service, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -5 }}
//               className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
//             >
//               <div className="p-8">
//                 <div className="bg-indigo-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
//                   {service.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
//                 <p className="text-gray-600 mb-4">{service.description}</p>
//                 <ul className="space-y-2">
//                   {service.highlights.map((highlight, i) => (
//                     <li key={i} className="flex items-start">
//                       <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                       </svg>
//                       <span className="text-gray-700">{highlight}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="px-8 pb-8">
//                 <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
//                   Learn more
//                   <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                   </svg>
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Our Process */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl mb-20"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-2">
//             <div className="p-12 text-white">
//               <h2 className="text-3xl font-bold mb-6">Our Proven Process</h2>
//               <p className="text-indigo-100 mb-8 max-w-lg">
//                 We follow a rigorous methodology to ensure successful delivery of every project, combining industry best practices with our own hard-earned experience.
//               </p>
//               <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
//                 Download Process PDF
//               </button>
//             </div>
//             <div className="p-8 lg:p-12 bg-white/10 backdrop-blur-sm">
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {process.map((item, index) => (
//                   <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/20">
//                     <div className="text-white text-2xl font-bold mb-2">{item.step}</div>
//                     <h3 className="text-white font-semibold mb-1">{item.title}</h3>
//                     <p className="text-indigo-100 text-sm">{item.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* CTA */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-center"
//         >
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Ready to transform your business?</h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
//             Let's discuss how our services can help you achieve your goals.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
//               Get a Free Consultation
//             </button>
//             <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
//               Browse Case Studies
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Services;

import React from "react";
import "./Service.css";
import {
  Dashboard,
  Email,
  Settings,

} from "@mui/icons-material";

const services = [
  {
    id: 1,
    icon: <Settings />,
    title: "Incredible Infrastructure",
    description:
      "Lorem ipsum dolor amet, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    link: "/services/service-details/",
  },
  {
    id: 2,
    icon: <Email />,
    title: "Email Notifications",
    description:
      "Lorem ipsum dolor amet, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    link: "/services/service-details/",
  },
  {
    id: 3,
    icon: <Dashboard />,
    title: "Simple Dashboard",
    description:
      "Lorem ipsum dolor amet, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    link: "/services/service-details/",
  },
  {
    id: 4,
    icon: <Dashboard />,
    title: "Simple Dashboard",
    description:
      "Lorem ipsum dolor amet, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    link: "/services/service-details/",
  },
];
const Service = () => {
  return (
    <div>
      <div className="page-title-area">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <h2>Services</h2>
              <p>UNDER CONSTRUCTION</p>
            </div>
          </div>
        </div>
        <div className="shape1">
          <img
            alt="shape"
            loading="lazy"
            width="202"
            height="202"
            decoding="async"
            data-nimg="1"
            src="/shape1.png"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape2 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="22"
            height="22"
            decoding="async"
            data-nimg="1"
            src="/shape2.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape3">
          <img
            alt="shape"
            loading="lazy"
            width="28"
            height="28"
            decoding="async"
            data-nimg="1"
            src="/shape3.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape4">
          <img
            alt="shape"
            loading="lazy"
            width="21"
            height="20"
            decoding="async"
            data-nimg="1"
            src="/shape4.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape5">
          <img
            alt="shape"
            loading="lazy"
            width="182"
            height="146"
            decoding="async"
            data-nimg="1"
            src="/shape5.png"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape6 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="21"
            height="20"
            decoding="async"
            data-nimg="1"
            src="/shape4.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape7">
          <img
            alt="shape"
            loading="lazy"
            width="21"
            height="20"
            decoding="async"
            data-nimg="1"
            src="/shape4.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="shape8 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="22"
            height="22"
            decoding="async"
            data-nimg="1"
            src="/shape2.svg"
            style={{ color: "transparent" }}
          />
        </div>
      </div>

      {/* <div className="services-area-two  pt-8 pb-50 bg-f9f6f6">
        <div className="containers">
          <div className="section-title">
            <h2>Our Services</h2>
            <div className="bar"></div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className=" flex flex-wrap justify-content-start">
            {services.map((service) => (
              <div className="col-lg-4 col-sm-6">
                <div className="single-services-box">
                  <div className="icon">{service.icon}</div>
                  <h3>
                    <a href={service.link}>{service.title}</a>
                  </h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Service;
