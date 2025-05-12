'use client'
// SplashScreen.tsx
import { useEffect, useState } from 'react';
import STORE_LOGO from "../../../../public/logo.svg"; // This gives you a string URL
import './SplashScreen.css';

const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(true);

    // Set the splash screen to hide after 1 second minimum
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000); // 1 second minimum delay

        // Clean up timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    // If splash screen is still visible, show it
    if (showSplash) {
        return (
            <div className="splash-screen">
                <div className="logos">
                    <img src='/logo.svg' alt="Logo" className="logo-img" />
                </div>
            </div>
        );
    }

    return null; // Once the time passes, return null to hide the splash screen
};

export default SplashScreen;
