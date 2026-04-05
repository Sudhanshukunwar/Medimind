import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    // State to track if we are on mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            backgroundColor: '#f0f2f5', 
            minHeight: '100vh',
            width: '100vw',
            overflowX: 'hidden' // Prevents side-scrolling
        }}>
            {/* 1. Hide Sidebar on mobile, or you can make it a toggle drawer later */}
            {!isMobile && <Sidebar />}
            
            {/* 2. Dynamic Margin: 0px on mobile, 260px on desktop */}
            <main style={{ 
                flex: 1, 
                marginLeft: isMobile ? '0' : '260px', 
                padding: isMobile ? '10px' : '30px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: isMobile ? '0px' : '15px', // Square corners on mobile looks better
                    padding: isMobile ? '15px' : '25px', 
                    minHeight: '85vh',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;