import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './nav.css'; // Import your CSS file

// Navigation links array
export const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Login', path: '/login' }
];

function Nav() {
    return (
        <nav className="nav-bar">
            <div className="nav-logo">
                <img src="/kvo.png" alt="Logo" className="logo" style={{ width: '40px', height: '40px' }} />
                <h2>KVO</h2>
            </div>
            <div className="nav-links">
                {navLinks.map((link, index) => (
                    <Link key={index} to={link.path} className="nav-link">
                        {link.text}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default Nav;
