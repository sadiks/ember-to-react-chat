// frontend/src/components/FileUpload.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

const FILE_ICONS = { '.hbs': '🟠', '.js': '🟡', '.ts': '🔷' };

function FileUpload({ onConverted, onFileSelect }) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(f => ({
      file: f,
      name: f.name,
      ext: '.' + f.name.split('.').pop(),
      status: 'pending',
      result: null,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.hbs', '.js', '.ts'] },
    multiple: true,
  });

  const convertAll = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      // Set converting
      setFiles(prev => prev.map((f, idx) =>
        idx === i ? { ...f, status: 'converting' } : f
      ));

      try {
        const formData = new FormData();
        formData.append('file', files[i].file);

        const res = await fetch('http://localhost:4000/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'done', result: data } : f
        ));

        onConverted(data);

      } catch (err) {
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'error' } : f
        ));
      }
    }
  };

  const clearAll = () => setFiles([]);
  const hasPending = files.some(f => f.status === 'pending');

  return (
    <div className="upload-section">
      <span className="upload-label">📁 Ember Files</span>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <div className="icon">📂</div>
        <p>{isDragActive ? 'Drop files here...' : 'Drag & drop Ember files here'}</p>
        <p className="hint">.hbs · .js · .ts — multiple files supported</p>
      </div>

      {files.length > 0 && (
        <>
          <div className="file-queue-header">
            <span className="file-queue-label">Queue ({files.length})</span>
            <button className="clear-btn" onClick={clearAll}>Clear all</button>
          </div>

          <div className="file-queue">
            {files.map((f, i) => (
              <div
                key={i}
                className={`file-item ${f.result ? 'active' : ''}`}
                onClick={() => f.result && onFileSelect(f.result)}
              >
                <span className="file-icon">
                  {FILE_ICONS[f.ext] || '📄'}
                </span>
                <span className="file-name">{f.name}</span>
                <span className={`file-status ${f.status}`}>
                  {f.status === 'converting' ? '⏳' : f.status}
                </span>
              </div>
            ))}
          </div>

          <button
            className="convert-all-btn"
            onClick={convertAll}
            disabled={!hasPending}
          >
            {hasPending
              ? `⚡ Convert ${files.filter(f => f.status === 'pending').length} file(s)`
              : '✅ All converted'}
          </button>
        </>
      )}
    </div>
  );
}

export default FileUpload;