import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div style={{ display: 'flex', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            {/* The Sidebar stays fixed on the left */}
            <Sidebar />
            
            {/* The main content area shifts to the right */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
                <div style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '15px', 
                    padding: '25px', 
                    minHeight: '85vh',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                }}>
                    <Outlet /> {/* This renders the specific sub-page (Analytics, History, etc.) */}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;