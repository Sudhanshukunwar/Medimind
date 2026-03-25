import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Adjust this URL to match your backend port
                const response = await axios.get('http://localhost:8080/api/v1/history/all', { withCredentials: true });
                setHistory(response.data.data);

                // Format data for the Pie Chart
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
        <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h2>User Health Dashboard</h2>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Stats Card */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', flex: '1', minWidth: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3>Test Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                {stats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* History Table Card */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', flex: '2', minWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3>Recent History</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th>Test Type</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td>{item.testType}</td>
                                    <td style={{ color: item.result.includes('Suffering') ? 'red' : 'green' }}>{item.result}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;