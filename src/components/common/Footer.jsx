// Footer.jsx
import React from 'react';

function Footer() {
    return (
        <>
            <footer style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', color: '#fff' }}>
                <div>
                    <p>HOME</p>
                    <p>ABOUT</p>
                </div>
                
                <div>
                    <p>Contact Us</p>
                    <p>+251985187059</p>
                    <p>example@gmail.com</p>
                </div>
            </footer>
            <p style={{ textAlign: 'center', width: '100%', height: '50%', background: '#333' }}>@ All rights reserved</p>
        </>
    );
}

export default Footer;
