// Pages.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../home/Home';
import Footer from '../common/Footer';
import Header from '../common/Header';
import News from '../news/News';
import About from '../about/Abouts';
import Contact from '../contact/Contact';
import Services from '../service/Service';
import NewsDetails from '../news/NewsDetails';
import LettersPortal from '../portal/LettersPortal';

const Pages = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/details/:id" element={<NewsDetails />} />
            <Route path="/portal" element={<LettersPortal />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Pages;