import React from "react";
import "./Hero.css";
function Hero() {
  return (
    <>
      <div class="hero-section">
        <div class="hero-content">
          <div class="live-indicator">Live</div>
          <h1>Bisofftu cso meeting now</h1>
          <p>for civil society association</p>
          <button>Watch Live at 4:35 AM EST</button>
        </div>

        <div class="video-thumbnail">
          <iframe
            src="https://www.youtube.com/embed/AdDkHmuYWaY"
            title="Video Thumbnail"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>{" "}
        </div>
        <div class="recent-articles">
        <div>
          <h4>November 19, 2024</h4>
          <p>
            <a href="#">Situation Of Ergent Metting for all CSO</a>
          </p>
        </div>

        <div>
          <h4>November 30, 2024</h4>
          <p>
            <a href="#">Last Finace Report Date warnning</a>
          </p>
        </div>
      </div>
      </div>
   
     
    </>
  );
}

export default Hero;
