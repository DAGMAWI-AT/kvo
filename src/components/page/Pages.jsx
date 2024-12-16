import React from 'react';
import Home from '../home/Home';
import { Routes, Route } from "react-router-dom";
import Footer from '../common/Footer';
import Header from '../common/Header';
import News from '../news/News';
import Abouts from '../about/Abouts';
import Contact from '../contact/Contact';

function Pages() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div style={{ flex: 1 }}> {/* Main content flex area */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/about" element={<Abouts />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default Pages;
