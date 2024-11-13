import React from 'react';
import Home from '../Home';
import { Routes, Route } from "react-router-dom";
import Nav from '../common/Nav';
import Footer from '../common/Footer';

function Pages() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Nav />
            <div style={{ flex: 1 }}> {/* Main content flex area */}
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default Pages;
