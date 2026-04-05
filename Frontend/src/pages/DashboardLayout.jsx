import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Install react-icons if you haven't

const DashboardLayout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(false); // Close mobile menu if resized to desktop
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div style={{ 
            display: 'flex', 
            backgroundColor: '#f0f2f5', 
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            overflowX: 'hidden' 
        }}>
            {/* 1. MOBILE OVERLAY: Dims the background when sidebar is open */}
            {isMobile && isSidebarOpen && (
                <div 
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 40
                    }}
                />
            )}

            {/* 2. SIDEBAR: Fixed on Desktop, Sliding on Mobile */}
            <div style={{
                position: isMobile ? 'fixed' : 'relative',
                left: isMobile ? (isSidebarOpen ? '0' : '-260px') : '0',
                transition: 'left 0.3s ease',
                zIndex: 50,
                height: '100vh'
            }}>
                <Sidebar />
            </div>
            
            {/* 3. MAIN CONTENT */}
            <main style={{ 
                flex: 1, 
                marginLeft: isMobile ? '0' : '260px', 
                padding: isMobile ? '10px' : '30px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                {/* MOBILE HEADER: Only shows the menu button on small screens */}
                {isMobile && (
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button 
                            onClick={toggleSidebar}
                            style={{ 
                                background: '#fff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '10px', 
                                display: 'flex', 
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
                            }}
                        >
                            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>MediMind Pro</span>
                    </div>
                )}

                <div style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: isMobile ? '8px' : '15px', 
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