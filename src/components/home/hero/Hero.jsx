import React, { useState, useEffect } from "react";
import "./Hero.css";

function Hero() {
  const slides = [
    {
      image: "/oromia.webp",
      title: "Bisofftu Finance Office",
      description: "For Civil Society Association",
    },
    {
      image: "/Ethiopia.jpg",
      title: "Empowering Communities",
      description: "Driving Change through Collaboration",
    },
    {
      image: "/bishoftu.jpg",
      title: "Innovating Solutions",
      description: "Building a Better Tomorrow",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const urgentMeetings = [
    {
      date: "November 19, 2024",
      description: "Situation Of Urgent Meeting for all CSO",
    },
    {
      date: "November 30, 2024",
      description: "Last Finance Report Date Warning",
    },
    { date: "December 5, 2024", description: "End-of-Year Planning Session" },
  ];

  const [currentMeeting, setCurrentMeeting] = useState(
    urgentMeetings.length - 1
  );

  const handlePreviousMeeting = () => {
    setCurrentMeeting((prev) =>
      prev === 0 ? urgentMeetings.length - 1 : prev - 1
    );
  };

  const handleNextMeeting = () => {
    setCurrentMeeting((prev) => (prev + 1) % urgentMeetings.length);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero relative h-screen w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/30"></div>

      {/* Hero content */}
      <div className="relative  top-20 md:top-10 lg:top-2 z-10 flex flex-col justify-center h-full text-left px-5 sm:px-10 md:px-14 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
          {slides[currentSlide].title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10">
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 flex justify-center w-full space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
              index === currentSlide ? "bg-blue-500" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>

      {/* Video box */}
      <div className="absolute z-50 top-24 sm:top-28 right-5 sm:right-16 bg-gray-800 bg-opacity-90 p-2 sm:p-2 rounded-lg shadow-md ">
        <iframe
          className="w-44 sm:w-60 h-28 sm:h-36 rounded"
          src="https://www.youtube.com/embed/AdDkHmuYWaY"
          title="Video Thumbnail"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="urgent_meeting">
        <button className="nav-btn" onClick={handlePreviousMeeting}>
          &lt;
        </button>

        <div>
          <h1 className="font-bold font-serif text-xl mb-4 text-red-400">
            {" "}
            Urgent Meeting
          </h1>

          <h4>{urgentMeetings[currentMeeting].date}</h4>
          <p>
            <a href="#">{urgentMeetings[currentMeeting].description}</a>
          </p>
        </div>
        <button className="nav-btn" onClick={handleNextMeeting}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Hero;
