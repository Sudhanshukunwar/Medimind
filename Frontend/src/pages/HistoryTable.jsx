import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryTable = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/history/all', { withCredentials: true })
            .then(res => setHistory(res.data.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Your Prediction History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #f0f2f5', textAlign: 'left', color: '#7f8c8d' }}>
                        <th style={{ padding: '15px' }}>Date</th>
                        <th>Test Type</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item._id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                            <td style={{ padding: '15px', color: '#2c3e50' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td style={{ fontWeight: '500' }}>{item.testType}</td>
                            <td style={{ color: item.result.includes('Suffering') ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>
                                {item.result}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;