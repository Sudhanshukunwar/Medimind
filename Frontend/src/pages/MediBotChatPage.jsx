import React, { useState } from 'react';
import axios from 'axios';
import './ChatPage.css'; // Add some styling here

const MediBotChatPage = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm MediBot. How can I help you with your health data today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8080/api/v1/ai/chat", 
                { message: input }, 
                { withCredentials: true }
            );
            
            setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Error connecting to MediBot. Check your internet!", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-page-container">
            <div className="chat-display">
                {messages.map((m, i) => (
                    <div key={i} className={m.isBot ? "bot-msg" : "user-msg"}>
                        {m.text}
                    </div>
                ))}
                {loading && <div className="bot-msg">Typing...</div>}
            </div>
            <div className="chat-input-area">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask MediBot..."
                />
                <button onClick={sendMessage} disabled={loading}>Send</button>
            </div>
        </div>
    );
};

export default MediBotChatPage;