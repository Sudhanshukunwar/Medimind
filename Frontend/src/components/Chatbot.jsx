import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';
import robotIcon from '../assets/medibot-robot.png'; 

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am MediBot. How can I help you understand your health reports today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        const userMsg = { text: userText, isBot: false };
        
        // Add user message to UI immediately
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        
        // --- IDENTITY CHECK LOGIC ---
        const lowerInput = userText.toLowerCase();
        const identityKeywords = ["who built", "who made", "creator", "developer", "about medimind", "who are you"];
        
        if (identityKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
                const identityReply = { 
                    text: "MediMind and this website were built by Sudhanshu Kunwar and his dedicated team.", 
                    isBot: true 
                };
                setMessages(prev => [...prev, identityReply]);
            }, 500); // Slight delay to make it feel natural
            return; // Stop here so it doesn't call the API
        }
        // -----------------------------

        setLoading(true);

        try {
            const res = await axios.post(
                import.meta.env.VITE_API_URL + "/api/v1/ai/chat", 
                { message: userText }, 
                { withCredentials: true } 
            );

            setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);

        } catch (err) {
            const errorMsg = err.response?.status === 401 
                ? "Please login to analyze your medical data!" 
                : "Sorry, I'm having trouble connecting to my brain. Please try again!";
                
            setMessages(prev => [...prev, { text: errorMsg, isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>MediBot AI 🤖</span>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="message bot">Thinking...</div>}
                    </div>
                    <div className="chat-footer">
                        <input 
                            value={input} 
                            disabled={loading}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={loading ? "Analyzing..." : "Ask MediBot..."} 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} disabled={loading}>
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}

            <button 
                className={`chat-toggle-btn ${loading ? 'thinking-active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <span style={{ fontSize: '24px', color: '#0088FE', fontWeight: 'bold' }}>✖</span>
                ) : (
                    <img src={robotIcon} alt="MediBot" />
                )}
            </button>
        </div>
    );
};

export default Chatbot;