import React from "react";
import {
  AddLocationAltOutlined,
  EmailOutlined,
  PhoneIphone,
} from "@mui/icons-material";
import "./Footer.css";
import { Link } from "react-router-dom";

export const navLinks = [
  { text: "Home", path: "/" },
  { text: "About", path: "/about" },
  { text: "Services", path: "/" },
  { text: "All CSAs", path: "/csas" },
  { text: "Terms and Policy", path: "/terms" },
  { text: "FAQ", path: "/faq" },
  { text: "Login", path: "/login" },
];
function Footer() {
  return (
    <>
      <footer class="footer-area bg-f7fafd">
        <div class="container">
          <div class="row">
            <div
              class="col-lg-3 col-md-6 aos-init aos-animate"
              data-aos="fade-in"
              data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div class="single-footer-widget">
                <div class="logo">
                  <a href="/">
                    <img
                      alt="logo"
                      loading="lazy"
                      width="110"
                      height="36"
                      decoding="async"
                      data-nimg="1"
                      src="/kvo.png"
                      style={{color: "transparent"}}
                    />
                  </a>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi.
                </p>
              </div>
            </div>
            <div
              class="col-lg-3 col-md-6 aos-init aos-animate"
              data-aos="fade-in"
              data-aos-delay="200"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div class="single-footer-widget ps-5">
                <h3>Company</h3>
                <ul class="list">
                  <li>
                    <a href="/about/">About Us</a>
                  </li>
                  <li>
                    <a href="/services/">Services</a>
                  </li>
                  <li>
                    <a href="/features/">Features</a>
                  </li>
                  <li>
                    <a href="/pricing/">Our Pricing</a>
                  </li>
                  <li>
                    <a href="/blog/">Latest News</a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-lg-3 col-md-6 aos-init aos-animate"
              data-aos="fade-in"
              data-aos-delay="300"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div class="single-footer-widget">
                <h3>Support</h3>
                <ul class="list">
                  <li>
                    <a href="/faq/">FAQ's</a>
                  </li>
                  <li>
                    <a href="/privacy-policy/">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/terms-conditions/">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a href="/team/">Team</a>
                  </li>
                  <li>
                    <a href="/contact/">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-lg-3 col-md-6 aos-init aos-animate"
              data-aos="fade-in"
              data-aos-delay="400"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div class="single-footer-widget">
                <h3>Address</h3>
                <ul class="footer-contact-info">
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    27 Division St, New York, NY 10002, USA
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email:{" "}
                    <a href="mailto:startp@gmail.com">startp@gmail.com</a>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Phone: <a href="tel:321984754">+ (321) 984 754</a>
                  </li>
                </ul>
                <ul class="social-links">
                  <li>
                    <a
                      href="https://www.facebook.com/"
                      class="facebook"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.twitter.com/"
                      class="twitter"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagramcom/"
                      class="instagram"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        ></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/"
                      class="linkedin"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-12 col-md-12">
              <div class="copyright-area">
                <p>
                  Copyright © 2024 StartP. All rights reserved by{" "}
                  <a href="https://envytheme.com/" target="_blank">
                    EnvyTheme
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          alt="map"
          loading="lazy"
          width="910"
          height="443"
          decoding="async"
          data-nimg="1"
          class="map"
          src="/map.png"
          style={{color: "transparent"}}
        />
        <div class="shape1">
          <img
            alt="shape"
            loading="lazy"
            width="202"
            height="202"
            decoding="async"
            data-nimg="1"
            src="/shape1.png"
            style={{color: "transparent"}}
          />
        </div>
        <div class="shape8 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="22"
            height="22"
            decoding="async"
            data-nimg="1"
            src="/shape2.svg"
            style={{color: "transparent"}}
          />
        </div>
      </footer>
      <p className="right">@ All rights reserved</p>
    </>
  );
}

export default Footer;
