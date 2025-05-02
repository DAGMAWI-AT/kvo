import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ChevronDown } from "react-feather";
import axios from "axios";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/hero`)
      .then((res) => {
        setSlides(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch slides:", err);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;

  const overlayGradient = "bg-gradient-to-r from-black/70 via-black/50 to-black/70";
  const videoUrl = "https://www.youtube.com/embed/AdDkHmuYWaY";

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={slides[currentSlide].id}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/hero/${slides[currentSlide].image_url}`}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className={`absolute inset-0 ${overlayGradient}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl text-white space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">{slides[currentSlide].subtitle}</p>
        </motion.div>
      </div>

      {/* Arrows */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all"
        >
          <FiChevronLeft className="text-white w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all"
        >
          <FiChevronRight className="text-white w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20 p-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white h-2 w-5" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown className="h-8 w-8 text-white animate-bounce" />
      </motion.div>

      {/* Video Embed */}
      {videoUrl && (
        <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
          <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-indigo-400/30">
            <iframe
              src={videoUrl}
              title="About Us Video"
              className="w-64 h-40"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;


// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { ChevronDown } from "react-feather";

// // Slides array (static for now, but could be dynamic too)
// const slides = [
//   {
//     id: 1,
//     image: "/oromia.webp",
//     title: "Bishoftu Finance Office",
//     subtitle: "Empowering Civil Society Associations",
//     buttonLabel: "Learn More",
//   },
//   {
//     id: 2,
//     image: "/Ethiopia.jpg",
//     title: "Community Development",
//     subtitle: "Driving Sustainable Change Through Collaboration",
//     buttonLabel: "Get Involved",
//   },
//   {
//     id: 3,
//     image: "/bishoftu.jpg",
//     title: "Financial Innovation",
//     subtitle: "Building Transparent Financial Systems",
//     buttonLabel: "Explore Now",
//   },
// ];

// // 🧠 Dynamic video URL — (can be fetched from API or database later)
// const videoUrl = "https://www.youtube.com/embed/AdDkHmuYWaY"; 
// // 👆🏼 If no video, set to null, example: const videoUrl = null;

// const Hero = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [direction, setDirection] = useState(1);

//   const nextSlide = () => {
//     setDirection(1);
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setDirection(-1);
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToSlide = (index) => {
//     setDirection(index > currentSlide ? 1 : -1);
//     setCurrentSlide(index);
//   };

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 8000);
//     return () => clearInterval(interval);
//   }, []);

//   const overlayGradient = "bg-gradient-to-r from-black/80 via-black/50 to-black/80";

//   return (
//     <section className="relative h-screen overflow-hidden bg-black">
//       {/* Background */}
//       <div className="absolute inset-0">
//         <AnimatePresence custom={direction} initial={false}>
//           <motion.div
//             key={slides[currentSlide].id}
//             custom={direction}
//             initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
//             transition={{ duration: 1, ease: "easeInOut" }}
//             className="absolute inset-0"
//           >
//             <img
//               src={slides[currentSlide].image}
//               alt={slides[currentSlide].title}
//               className="w-full h-full object-cover object-center"
//               loading="eager"
//             />
//             <div className={`absolute inset-0 ${overlayGradient}`} />
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
//         <motion.div
//           key={slides[currentSlide].id}
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -30 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-3xl text-white space-y-6"
//         >
//           <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
//             {slides[currentSlide].title}
//           </h1>
//           <p className="text-lg md:text-2xl text-gray-200">{slides[currentSlide].subtitle}</p>
//           {slides[currentSlide].buttonLabel && (
//             <button type="button" className="bg-white text-blue-950 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105">
//               {slides[currentSlide].buttonLabel}
//             </button>
//           )}
//         </motion.div>
//       </div>

//       {/* Navigation Arrows */}
//       <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
//         <button
//           onClick={prevSlide}
//           className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all"
//           aria-label="Previous Slide"
//         >
//           <FiChevronLeft className="text-white w-6 h-6" />
//         </button>
//       </div>
//       <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
//         <button
//           onClick={nextSlide}
//           className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all"
//           aria-label="Next Slide"
//         >
//           <FiChevronRight className="text-white w-6 h-6" />
//         </button>
//       </div>

//       {/* Slide Indicators */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20 p-1">
//         {slides.map((slide, index) => (
//           <button
//             key={slide.id}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//               currentSlide === index ? "bg-white h-2 w-5" : "bg-white/40"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.7 }}
//         transition={{ delay: 2 }}
//         className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
//       >
//         <ChevronDown className="h-8 w-8 text-white animate-bounce" />
//       </motion.div>

//       {/* Optional Video Embed (only if videoUrl exists) */}
//       {videoUrl && (
//         <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
//           <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-indigo-400/30">
//             <iframe
//               src={videoUrl}
//               title="About Us Video"
//               className="w-64 h-40"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               loading="lazy"
//             />
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default Hero;
