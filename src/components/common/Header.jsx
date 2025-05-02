// import React, { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTimes, FaBars } from "react-icons/fa";
// import { navLinks } from "./../data";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isDarkBackground, setIsDarkBackground] = useState(false);
//   const headerRef = useRef(null);
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 100);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const bgColor = getComputedStyle(entry.target).backgroundColor;
//             setIsDarkBackground(isColorDark(bgColor));
//           }
//         });
//       },
//       { root: null, rootMargin: "0px", threshold: 0.1 }
//     );

//     const firstSection = document.querySelector("#hero-section");
//     if (firstSection) observer.observe(firstSection);

//     return () => {
//       if (firstSection) observer.unobserve(firstSection);
//     };
//   }, []);

//   const isColorDark = (rgbColor) => {
//     const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
//     const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//     return luminance <= 0.5;
//   };

//   const textColor = isScrolled || !isDarkBackground ? "text-gray-500" : "text-gray-800";
//   const iconColor = isScrolled || !isDarkBackground ? "text-gray-700" : "text-gray-300";

//   const menuButtonHover = isScrolled
//     ? "hover:bg-gray-100"
//     : isDarkBackground
//     ? "hover:bg-white/20"
//     : "hover:bg-gray-900/20";

//   return (
//     <header
//       ref={headerRef}
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//         isScrolled ? "bg-white bg-opacity-90 backdrop-blur-sm shadow-lg" : "bg-transparent"
//       }`}
//     >
//       <div className="container mx-auto flex justify-between items-center p-4">
//         <div className="flex items-center space-x-3">
//           <Link to="/" className="flex items-center">
//             <img src="/logo3.png" alt="Company Logo" className="h-12" />
//           </Link>
//           <span className={`text-xl font-bold ${textColor}`}>Bishoftu Finance</span>
//         </div>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex space-x-6 relative">
//           {navLinks.map((link, index) => {
//             const isActive = location.pathname === link.path;
//             return (
//               <div key={index} className="relative">
//                 <Link
//                   to={link.path}
//                   className={`font-medium text-lg relative ${
//                     location.pathname === link.path
//                       ? "text-blue-500 font-semibold"
//                       : "text-gray-400 hover:text-gray-500"
//                   }`}                >
//                   {link.text}
//                 </Link>
//                 {isActive && (
//                   <motion.div
//                     layoutId="activeIndicator"
//                     className="absolute left-0 bottom-[-4px] h-[2px] bg-blue-500 w-full"
//                     transition={{ type: "spring", stiffness: 300, damping: 25 }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         {/* Mobile Menu Toggle */}
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className={`md:hidden p-2 rounded-full transition-colors ${menuButtonHover}`}
//           aria-label="Toggle Menu"
//         >
//           {isMenuOpen ? (
//             <FaTimes className={`w-5 h-5 ${iconColor}`} />
//           ) : (
//             <FaBars className={`w-5 h-5 ${iconColor}`} />
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.nav
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={{
//               open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
//               closed: { x: "100%", transition: { duration: 0.3 } },
//             }}
//             className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg md:hidden"
//           >
//             <div className="p-4">
//               <button
//                 onClick={() => setIsMenuOpen(false)}
//                 className="p-2 rounded-full hover:bg-gray-200 transition-colors"
//                 aria-label="Close Menu"
//               >
//                 <FaTimes className="w-5 h-5 text-gray-700" />
//               </button>
//             </div>
//             <ul className="flex flex-col space-y-4 p-4">
//               {navLinks.map((link, index) => {
//                 const isActive = location.pathname === link.path;
//                 return (
//                   <li key={index} className="relative">
//                     <Link
//                       to={link.path}
//                       className={`font-medium text-sm bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 transition-colors`}
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {link.text}
//                     </Link>
//                     {isActive && (
//                       <motion.div
//                         layoutId="activeIndicatorMobile"
//                         className="absolute left-0 bottom-[-2px] h-[2px] bg-blue-500 w-full"
//                         transition={{ type: "spring", stiffness: 300, damping: 25 }}
//                       />
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </motion.nav>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// };

// export default Header;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'react-feather';
import { useNavigate } from 'react-router';
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'Services', 
      href: '/services',
      // submenu: [
      //   { name: 'Digital Transformation', href: '#digital' },
      //   { name: 'Cloud Solutions', href: '#cloud' },
      //   { name: 'Data Analytics', href: '#analytics' },
      //   { name: 'AI Integration', href: '#ai' }
      // ]
    },
    { name: 'About', href: '/about' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">

            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${isScrolled ? 'bg-gray-200' : 'bg-white'}`}>
              <span className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-gray-400'}`}>
           <img src="/logo3.png" alt="Company Logo" className="h-12" />
        </span>
            </div>

            <span className={`text-lg font-bold ${isScrolled ? 'text-indigo-600' : 'text-gray-500'}`}>Bishoftu Finance Office</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <a 
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-gray-400 hover:text-indigo-200'}`}
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                  onMouseLeave={() => item.submenu && setActiveSubmenu(null)}
                >
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className={`ml-1 transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`} size={16} />
                  )}
                </a>

                {item.submenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: activeSubmenu === item.name ? 1 : 0,
                      y: activeSubmenu === item.name ? 0 : 10
                    }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 mt-2 w-56 rounded-lg shadow-lg ${isScrolled ? 'bg-white' : 'bg-gray-900'}`}
                    onMouseEnter={() => setActiveSubmenu(item.name)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm ${isScrolled ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'text-gray-200 hover:bg-gray-800 hover:text-white'}`}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`ml-4 px-6 py-2 rounded-lg font-medium transition-colors ${isScrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 hover:bg-gray-100'}`}
              onClick={() => navigate("/user/login")}

            >
              Login
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        className={`md:hidden overflow-hidden ${isScrolled ? 'bg-white' : 'bg-gray-900'}`}
      >
        <div className="container mx-auto px-6 py-4">
          {navItems.map((item) => (
            <div key={item.name} className="mb-2">
              <button
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-indigo-50' : 'text-white hover:bg-gray-800'}`}
                onClick={() => item.submenu && setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
              >
                <a href={!item.submenu ? item.href : '#'} className="flex-1 text-left">
                  {item.name}
                </a>
                {item.submenu && (
                  <ChevronDown className={`ml-2 transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`} size={16} />
                )}
              </button>

              {item.submenu && activeSubmenu === item.name && (
                <div className="pl-4 mt-1">
                  {item.submenu.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      className={`block px-3 py-2 text-sm rounded-lg ${isScrolled ? 'text-gray-600 hover:bg-indigo-50' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
         <button
  className={`w-full mt-4 px-6 py-2 rounded-lg font-medium ${
    isScrolled
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : 'bg-white text-indigo-600 hover:bg-gray-100'
  }`}
  onClick={() => navigate("/user/login")}
>
  Login
</button>

        </div>
      </motion.div>
    </header>
  );
};

export default Header;