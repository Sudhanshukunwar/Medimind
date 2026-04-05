import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // FIXED: Corrected the backticks and URL format
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/history/all`, { withCredentials: true });
                setHistory(response.data.data);

                const counts = response.data.data.reduce((acc, curr) => {
                    acc[curr.testType] = (acc[curr.testType] || 0) + 1;
                    return acc;
                }, {});
                
                const chartData = Object.keys(counts).map(key => ({
                    name: key,
                    value: counts[key]
                }));
                setStats(chartData);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        // FIXED: Reduced padding for mobile (10px) and used box-sizing
        <div style={{ padding: '10px', backgroundColor: '#f4f7f6', minHeight: '100vh', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>User Health Dashboard</h2>
            
            {/* Main Flex Container */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', width: '100%' }}>
                
                {/* Stats Card */}
                <div style={{ 
                    background: '#fff', 
                    padding: '15px', 
                    borderRadius: '10px', 
                    flex: '1 1 100%', // Take full width on small screens
                    maxWidth: '100%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box'
                }}>
                    <h3>Test Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={stats} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                    {stats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* History Table Card */}
                <div style={{ 
                    background: '#fff', 
                    padding: '15px', 
                    borderRadius: '10px', 
                    flex: '1 1 100%', // FIXED: Removed 500px min-width
                    maxWidth: '100%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    overflow: 'hidden' // Prevents content bleed
                }}>
                    <h3>Recent History</h3>
                    
                    {/* FIXED: Added a scrollable wrapper for the table */}
                    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th>Type</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{item.testType}</td>
                                        <td style={{ 
                                            color: item.result.includes('Suffering') || item.result.includes('cancerous') && !item.result.includes('non') ? 'red' : 'green',
                                            fontWeight: 'bold'
                                        }}>
                                            {item.result}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;