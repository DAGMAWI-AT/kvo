import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiClock, FiAlertTriangle, FiSpeaker } from "react-icons/fi";
import { ChevronDown } from "react-feather";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const SLIDE_INTERVAL = 8000;
const MEETING_INTERVAL = 6000;
const overlayGradient = "bg-gradient-to-r from-black/70 via-black/50 to-black/70";
const videoUrl = "https://www.youtube.com/embed/AdDkHmuYWaY";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(0);
  const [meetingsError, setMeetingsError] = useState(null);
  const [showLetterAlert, setShowLetterAlert] = useState(true);

  // Fetch Hero Slides
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/hero`)
      .then((res) => {
        if (!res.data.data?.length) {
          setError("No slides available. Please add hero slides.");
        }
        setSlides(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch slides:", err);
        setError("Failed to load slides. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Fetch Meeting Letters
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/letters`)
      .then((res) => {
        if (!res.data.data?.length) {
          setMeetingsError("No letters available. Please add meeting letters.");
        } else {
          setMeetingsError(null);
        }
        setMeetings(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch meetings:", err);
        setMeetingsError("Failed to load letters. Please try again later.");
      });
  }, []);

  // Slide Autoplay
  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [slides]);

  // Auto rotate meetings
  useEffect(() => {
    if (meetings.length < 2) return;
    const interval = setInterval(() => {
      setCurrentMeeting(prev => (prev + 1) % meetings.length);
    }, MEETING_INTERVAL);
    return () => clearInterval(interval);
  }, [meetings]);

  const handleDismissAlert = () => {
    setShowLetterAlert(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Bishoftu Finance Office
          </h2>
        </div>
      </div>
    );
  }

  const current = slides[currentSlide];
  const currentLetter = meetings[currentMeeting];
 const defaultImage= "/b1.jpg"
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Slide Content or Error */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          {error || slides.length === 0 ? (
                 <motion.div
                 key="error"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center p-4"
                 style={{
                   background: `url(${defaultImage}) center/cover`,
                 }}
               >
                 <div className={`absolute inset-0 ${overlayGradient}`} />
                 <div className="text-center max-w-2xl bg-white/10 backdrop-blur-md rounded-xl p-8 relative z-10">
                   <FiAlertTriangle className="mx-auto text-5xl text-yellow-400 mb-4" />
                   <h1 className="text-2xl font-bold text-white mb-2">Hero Section Unavailable</h1>
                   <p className="text-gray-300 mb-6">{error || "No slides available"}</p>
                 </div>
               </motion.div>
          ) : (
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={current?.id}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/hero/${current.image_url}`}
                  alt={current.title}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className={`absolute inset-0 ${overlayGradient}`} />
              </motion.div>
            </AnimatePresence>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-14">
        {!error && slides.length > 0 && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white space-y-4"
          >
            <h1 className="text-xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
              {current.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">{current.subtitle}</p>
          </motion.div>
        )}
      </div>

      {/* Navigation Controls */}
      {!error && slides.length > 1 && (
        <>
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
            <button onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)} 
              className="bg-white/20 hover:bg-white/40 p-2 rounded-full">
              <FiChevronLeft className="text-white w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
            <button onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)} 
              className="bg-white/20 hover:bg-white/40 p-2 rounded-full">
              <FiChevronRight className="text-white w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? "bg-white w-6" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Letter Alerts */}
      {/* <AnimatePresence mode="wait">
        {currentLetter && (
          <motion.div
            key={currentLetter.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-1 left-8 z-50 bg-blue-200 backdrop-blur-md text-gray-800 p-4 rounded-md shadow-md w-72"
          >
            <h4 className="font-bold text-lg text-blue-950 font-italic"><FiSpeaker/> Letter Alert</h4>
            <p className="text-sm font-medium truncate">{currentLetter.title || "Untitled"}</p>
            <p className="text-xs mt-2 text-gray-600">
            <FiClock/> {currentLetter.date ? new Date(currentLetter.date).toLocaleString() : "No date"}
            </p>
          </motion.div>
        )}
      </AnimatePresence> */}
      
<AnimatePresence mode="wait">
  {currentLetter && (() => {
    if (!currentLetter.date) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const letterDate = new Date(currentLetter.date);
    const cutoffDate = new Date(letterDate);
    cutoffDate.setDate(letterDate.getDate() + 2); // Add 2 days to letter date
    if (cutoffDate >= today) {
      return (

        <motion.div
          key={currentLetter.id}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-1 left-8 z-50 bg-blue-200 backdrop-blur-md text-gray-800 p-4 rounded-md shadow-md w-72"
        >
           <Link 
            to="/portal" 
            // className="block bg-blue-200 hover:bg-blue-300 backdrop-blur-md text-gray-800 p-4 rounded-md shadow-md w-72 transition-colors duration-200"
            onClick={() => {
              // Optional: Track click analytics or perform other actions
            }}
          >
          <h4 className="font-bold text-lg text-blue-950">
            <FiSpeaker className="inline mr-2" /> Letter Alert
          </h4>
          <p className="text-sm font-medium truncate">{currentLetter.title || "Untitled"}</p>
          <p className="text-xs mt-2 text-gray-600">
            <FiClock className="inline mr-1" />
            {letterDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
          </Link>

        </motion.div>

      );
    };
    return null;
  })()}
</AnimatePresence>
      {/* Scroll Indicator */}
      {(!error || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        >
          <ChevronDown className="h-8 w-8 text-white animate-bounce" />
        </motion.div>
      )}
    </section>
  );
};

export default Hero;