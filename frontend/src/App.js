// frontend/src/App.jsx
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChatWindow from './components/ChatWindow';
import ConvertedCode from './components/ConvertedCode';
import './App.css';

function App() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '👋 Hi! Upload one or more Ember files (.hbs or .js) and I\'ll convert them to React and explain the changes!'
  }]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileConverted = (result) => {
    setConvertedFiles(prev => {
      const exists = prev.find(f => f.fileName === result.fileName);
      if (exists) return prev.map(f => f.fileName === result.fileName ? result : f);
      return [...prev, result];
    });

    setMessages(prev => [
      ...prev,
      { role: 'user', content: `📁 Converted: ${result.fileName}` },
      { role: 'assistant', content: result.explanation },
      ...(result.todos?.length > 0 ? [{
        role: 'assistant',
        content: `⚠️ Items needing manual review in ${result.fileName}:\n${result.todos.map(t => `• ${t}`).join('\n')}`
      }] : [])
    ]);
  };

  const handleFileSelect = (result) => {
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: `📄 Showing: ${result.fileName}` }
    ]);
  };

  const handleSendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🔥 Ember → ⚛️ React</h2>
        </div>
        <div className="sidebar-content">
          <FileUpload
            onConverted={handleFileConverted}
            onFileSelect={handleFileSelect}
          />
          <ConvertedCode files={convertedFiles} />
        </div>
      </div>

      <ChatWindow
        messages={messages}
        onSend={handleSendMessage}
        loading={loading}
      />
    </div>
  );
}

export default App;