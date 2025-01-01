// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyles}>
            <p>&copy; 2025 BookWizards. All rights reserved.</p>
        </footer>
    );
};

const footerStyles = {
    backgroundColor: '#4b0082',
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
    position: 'fixed',
    bottom: '0',
    width: '100%',
};

export default Footer;
