import React from 'react';
import MedsReminder from '../components/MedsReminder';

const MedsPage = () => {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Pharmacy & Reminders</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Manage your daily medications and schedule.</p>
            
            <div style={{ maxWidth: '800px' }}>
                <MedsReminder />
            </div>
        </div>
    );
};

export default MedsPage;