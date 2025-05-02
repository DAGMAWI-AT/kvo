// import { motion } from 'framer-motion';
// import { Mail, Phone, MapPin } from 'react-feather';
// // import Logo from './../../../logo3';

// const Footer = () => {
//   const links = [
//     {
//       title: "Company",
//       items: [
//         { name: "About Us", href: "/about" },
//         { name: "Careers", href: "/careers" },
//         { name: "News", href: "/news" },
//         { name: "Contact", href: "/contact" }
//       ]
//     },
//     {
//       title: "Services",
//       items: [
//         { name: "Custom Software", href: "/services/software" },
//         { name: "Cloud Solutions", href: "/services/cloud" },
//         { name: "Data Analytics", href: "/services/analytics" },
//         { name: "UX/UI Design", href: "/services/design" }
//       ]
//     },
//     {
//       title: "Resources",
//       items: [
//         { name: "Blog", href: "/blog" },
//         { name: "Case Studies", href: "/case-studies" },
//         { name: "Whitepapers", href: "/whitepapers" },
//         { name: "Webinars", href: "/webinars" }
//       ]
//     }
//   ];

//   const contactInfo = [
//     {
//       icon: <Mail className="w-5 h-5 text-indigo-600" />,
//       text: "info@brighthop.com"
//     },
//     {
//       icon: <Phone className="w-5 h-5 text-indigo-600" />,
//       text: "+1 (555) 123-4567"
//     },
//     {
//       icon: <MapPin className="w-5 h-5 text-indigo-600" />,
//       text: "123 Tech Avenue, San Francisco, CA 94107"
//     }
//   ];

//   return (
//     <footer className="bg-gray-900 text-white pt-16 pb-8">
//       <div className="container mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
//           {/* Logo & Description */}
//           <div>
//             <motion.div 
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//               className="flex items-center mb-6"
//             >
//               {/* <Logo className="w-10 h-10" /> */}
//               <span className="ml-3 text-2xl font-bold">BrightHop</span>
//             </motion.div>
//             <p className="text-gray-400 mb-6">
//               Innovating business solutions through technology, strategy, and design to drive digital transformation.
//             </p>
//             <div className="flex space-x-4">
//               {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
//                 <a 
//                   key={social} 
//                   href="#" 
//                   className="text-gray-400 hover:text-white transition-colors"
//                   aria-label={social}
//                 >
//                   <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
//                     {social[0]}
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Links */}
//           {links.map((group) => (
//             <motion.div
//               key={group.title}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
//               <ul className="space-y-2">
//                 {group.items.map((item) => (
//                   <li key={item.name}>
//                     <a 
//                       href={item.href} 
//                       className="text-gray-400 hover:text-white transition-colors"
//                     >
//                       {item.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           ))}

//           {/* Contact Info */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
//             <ul className="space-y-3">
//               {contactInfo.map((item, index) => (
//                 <li key={index} className="flex items-start">
//                   <span className="mt-0.5 mr-3">{item.icon}</span>
//                   <span className="text-gray-400">{item.text}</span>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         </div>

//         {/* Copyright */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           viewport={{ once: true }}
//           className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
//         >
//           <p className="text-gray-500 text-sm mb-4 md:mb-0">
//             © {new Date().getFullYear()} BrightHop Technologies. All rights reserved.
//           </p>
//           <div className="flex space-x-6">
//             <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</a>
//             <a href="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</a>
//             <a href="#" className="text-gray-500 hover:text-white text-sm">Cookies</a>
//           </div>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




// Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt
} from "react-icons/fa";

const Footer = () => {
  const links = [
    {
      title: "Office",
      items: [
        { name: "About Us", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "CSOs", path: "/#" },
        { name: "News", path: "/news" },
      ]
    },
    {
      title: "Support",
      items: [
        { name: "FAQ", path: "/faq" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms", path: "/terms" },
        { name: "Contact", path: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo3.png"
                alt="Logo"
                className="w-10 h-10 rounded-lg shadow-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bishoftu Finance
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Empowering financial transparency and community development through 
              innovative governance solutions.
            </p>
          </div>

          {links.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  Bishoftu, Oromia, Ethiopia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <a href="mailto:info@example.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  csos@bishoftu.gov
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <a href="tel:+2510000000" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  +251 000 0000
                </a>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <a href="#" className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <FaFacebook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <FaTwitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <FaInstagram className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <FaLinkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Bishoftu Finance Office. All rights reserved.
            <br />
            Developed by{" "}
            <a 
              // href="https://dagmawiamare.netlify.app" 
              href="#" 

              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              korean international organization (KVO)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;