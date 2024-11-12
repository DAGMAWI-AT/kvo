import React from 'react';
import Home from '../Home';
import { Routes, Route } from "react-router-dom";
import Nav from '../common/Nav';
import Footer from '../common/Footer';

function Pages() {
    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>

        </div>
        {/* <Information /> */}
         <Footer />
         </>
        
    );
}

export default Pages;
