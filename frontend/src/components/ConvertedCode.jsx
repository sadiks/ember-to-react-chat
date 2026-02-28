// frontend/src/components/ConvertedCode.jsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ConvertedCode.css';

function ConvertedCode({ files }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!files || files.length === 0) return null;

  const active = files[activeIndex];

  const download = () => {
    const blob = new Blob([active.converted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = active.fileName.replace(/\.(hbs|js|ts)$/, '.jsx');
    a.click();
  };

  const copy = () => {
    navigator.clipboard.writeText(active.converted);
  };

  const downloadAll = () => {
    files.forEach(f => {
      const blob = new Blob([f.converted], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = f.fileName.replace(/\.(hbs|js|ts)$/, '.jsx');
      a.click();
    });
  };

  return (
    <div className="converted-panel">
      <div className="converted-panel-header">
        <span className="converted-panel-label">⚛️ Converted</span>
        {files.length > 1 && (
          <button className="download-btn" style={{ flex: 'none', padding: '3px 10px', fontSize: 11 }} onClick={downloadAll}>
            ⬇️ All
          </button>
        )}
      </div>

      {files.length > 1 && (
        <div className="converted-tabs">
          {files.map((f, i) => (
            <button
              key={i}
              className={`converted-tab ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              title={f.fileName}
            >
              {f.fileName.replace(/\.(hbs|js|ts)$/, '.jsx')}
            </button>
          ))}
        </div>
      )}

      <div className="code-block">
        <SyntaxHighlighter language="jsx" style={vscDarkPlus} showLineNumbers>
          {active.converted}
        </SyntaxHighlighter>
      </div>

      <div className="code-actions">
        <button className="copy-btn" onClick={copy}>📋 Copy</button>
        <button className="download-btn" onClick={download}>⬇️ Download</button>
      </div>

      {active.todos?.length > 0 && (
        <div className="todos-section">
          <div className="todos-title">⚠️ Manual Review Needed</div>
          {active.todos.map((t, i) => (
            <div key={i} className="todo-item">{t}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConvertedCode;