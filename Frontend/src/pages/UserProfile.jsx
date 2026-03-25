import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaUserCircle, FaEnvelope, FaIdBadge } from 'react-icons/fa';

const UserProfile = () => {
    const { userInfo } = useContext(UserContext);
    const user = userInfo?.data;

    return (
        <div style={{ maxWidth: '600px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>My Account Profile</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <FaUserCircle size={80} color="#3498db" />
                <div>
                    <h3 style={{ margin: 0 }}>{user?.username || "User"}</h3>
                    <p style={{ color: '#7f8c8d', margin: 0 }}>Patient Account</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e0e6ed' }}>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>USERNAME</label>
                    <span style={{ fontWeight: '500' }}>{user?.username}</span>
                </div>
                <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e0e6ed' }}>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>EMAIL ADDRESS</label>
                    <span style={{ fontWeight: '500' }}>{user?.email || "Not Provided"}</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;