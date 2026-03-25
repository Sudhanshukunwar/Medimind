import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AnalyticsOverview = () => {
    const [stats, setStats] = useState([]);
    const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetching from port 8080 as per your previous setup
                const res = await axios.get('http://localhost:8080/api/v1/history/all', { withCredentials: true });
                const counts = res.data.data.reduce((acc, curr) => {
                    acc[curr.testType] = (acc[curr.testType] || 0) + 1;
                    return acc;
                }, {});
                setStats(Object.keys(counts).map(key => ({ name: key, value: counts[key] })));
            } catch (err) {
                console.error("Stats fetch error", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Health Analytics Overview</h2>
            <hr style={{ border: '0.5px solid #eee', marginBottom: '30px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <h4 style={{ textAlign: 'center', color: '#7f8c8d' }}>Prediction Distribution</h4>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie data={stats} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {stats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOverview;