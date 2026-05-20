import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Welcome to Elegant Fashion! I am your AI assistant. How can I help you today?' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || message;
    if (!query.trim()) return;

    // Add user message to history
    setChatHistory((prev) => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setMessage('');
    
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      
      // Delay response slightly for natural chat feeling
      setTimeout(() => {
        setChatHistory((prev) => [...prev, { sender: 'bot', text: data.reply }]);
        setIsTyping(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'bot', text: 'I am having trouble connecting right now. Please feel free to message our support on WhatsApp!' },
        ]);
        setIsTyping(false);
      }, 600);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickReplies = ['What products do you have?', 'How long does shipping take?', 'EasyPaisa payment instructions'];

  return (
    <div className="chatbot-widget-container">
      {/* Floating Toggle Button */}
      <button
        className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Support Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window animate-fade">
          {/* Header */}
          <div className="chat-header">
            <div>
              <h3>Elegant AI Assistant</h3>
              <p className="status-indicator">Online &bull; Instant Help</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message-bubble ${msg.sender}`}>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message-bubble bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="chat-quick-replies">
            {quickReplies.map((reply, i) => (
              <button key={i} className="quick-reply-btn" onClick={() => handleSend(reply)}>
                {reply}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="chat-input-panel">
            <input
              type="text"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input"
            />
            <button className="chat-send-btn" onClick={() => handleSend()} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
