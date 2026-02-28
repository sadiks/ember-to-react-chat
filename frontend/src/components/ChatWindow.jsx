// frontend/src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';

function ChatWindow({ messages, onSend, loading }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-status" />
        <h3>Claude — Ember to React Assistant</h3>
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <span className="bubble">{msg.content}</span>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="avatar">🤖</div>
            <div className="bubble">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-bar">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about the conversion... (Enter to send, Shift+Enter for new line)"
          rows={1}
        />
        <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;