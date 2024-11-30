import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <div className="hero w-full pt-[4vh] md:pt-[12vh] h-screen bg-[#0f0715] overflow-hidden relative bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="flex justify-center items-center flex-col w-[90%] sm:w-[80%] h-full mx-auto relative z-10">
        <h1
          data-aos="fade-left"
          className="text-white text-opacity-80 text-center text-sm sm:text-lg uppercase font-medium font-roboto aos-init aos-animate"
        >
          Bisofftu Finace Office
        </h1>
        <h1
          data-aos="fade-right"
          data-aos-delay="150"
          className="tracking-[1.5px] text-center font-roboto font-semibold text-2xl sm:text-5xl bg-gradient-to-r from-[#3b82f6] to-[#2f4cac] bg-clip-text text-transparent mt-4 aos-init aos-animate"
        >
          Your Next Best Decision
        </h1>
        <p
          data-aos="zoom-in"
          data-aos-delay="300"
          className="w-[100%] sm:w-[70%] font-montserrat text-center text-xs sm:text-lg text-gray-400 mt-4 aos-init aos-animate"
        >
          for civil society association{" "}
yyy        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 text-white">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          className="text-3xl bounce-animation"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
        </svg>
      </div>
    </div>
  );
}

export default Hero;
