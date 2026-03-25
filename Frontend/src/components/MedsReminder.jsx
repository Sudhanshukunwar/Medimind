import React, { useState, useEffect } from 'react';
import './MedsReminder.css';

const MedsReminder = () => {
    // 1. Load data from localStorage on initial render
    const [meds, setMeds] = useState(() => {
        const savedMeds = localStorage.getItem('medimind_meds');
        return savedMeds ? JSON.parse(savedMeds) : [];
    });
    const [form, setForm] = useState({ name: '', time: '' });

    // 2. Save to localStorage whenever the 'meds' state changes
    useEffect(() => {
        localStorage.setItem('medimind_meds', JSON.stringify(meds));
    }, [meds]);

    // 3. Request Notification Permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // 4. SMART LOGIC: The Time Checker
    useEffect(() => {
        const checkTime = setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            setMeds(prevMeds => {
                return prevMeds.map(med => {
                    // If current time matches and we haven't sent a notification yet this minute
                    if (med.time === currentTime && !med.notified) {
                        sendNotification(med.name);
                        return { ...med, notified: true }; // Mark as notified
                    }
                    
                    // Reset 'notified' flag when the minute passes so it works tomorrow
                    if (med.time !== currentTime && med.notified) {
                        return { ...med, notified: false };
                    }
                    
                    return med;
                });
            });
        }, 10000); // Check every 10 seconds for accuracy

        return () => clearInterval(checkTime);
    }, []);

    const sendNotification = (medName) => {
        if (Notification.permission === "granted") {
            new Notification("MediMind: Time for Medication! 💊", {
                body: `Don't forget to take your ${medName}.`,
                icon: '/medibot-robot.png' // Ensure this path is correct in your public folder
            });
        }
    };

    const addMed = (e) => {
        e.preventDefault();
        if (!form.name || !form.time) return;

        const newMed = { 
            ...form, 
            id: Date.now(), 
            notified: false 
        };
        setMeds([...meds, newMed]);
        setForm({ name: '', time: '' });
    };

    const deleteMed = (id) => {
        setMeds(meds.filter(m => m.id !== id));
    };

    return (
        <div className="meds-container">
            <div className="meds-header">
                <h3>💊 Medication Reminders</h3>
                <p className="subtitle">Set reminders for your daily prescriptions</p>
            </div>
            
            <form onSubmit={addMed} className="meds-form">
                <input 
                    type="text" 
                    placeholder="Medicine (e.g. Paracetamol)" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                />
                <input 
                    type="time" 
                    value={form.time}
                    onChange={(e) => setForm({...form, time: e.target.value})}
                    required
                />
                <button type="submit" className="add-btn">Add Reminder</button>
            </form>

            <div className="meds-list">
                {meds.length === 0 ? (
                    <p className="empty-msg">No reminders set. Stay healthy!</p>
                ) : (
                    meds.map(med => (
                        <div key={med.id} className="med-card">
                            <div className="med-info">
                                <span className="med-name">{med.name}</span>
                                <span className="med-time">⏰ {med.time}</span>
                            </div>
                            <button className="delete-btn" onClick={() => deleteMed(med.id)}>
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedsReminder;