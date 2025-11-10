import React, { useState, useRef } from 'react';
import api from '../api/client';

export default function UploadModal({ onClose, onComplete, isDark }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.zip')) {
        setError('Please select a ZIP file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await api.upload('/upload', formData);
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-whatsapp-panel' : 'bg-white'} rounded-2xl max-w-lg w-full p-6 shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-whatsapp-text-primary' : 'text-gray-900'}`}>
            Upload WhatsApp Chat
          </h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-whatsapp-hover' : 'hover:bg-gray-100'} transition disabled:opacity-50`}
          >
            <svg className={`w-6 h-6 ${isDark ? 'text-whatsapp-icon' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`mb-6 p-4 ${isDark ? 'bg-whatsapp-bg' : 'bg-blue-50'} rounded-lg border ${isDark ? 'border-whatsapp-border' : 'border-blue-200'}`}>
          <h3 className={`font-semibold ${isDark ? 'text-whatsapp-text-primary' : 'text-blue-900'} mb-2`}>
            How to export your WhatsApp chat:
          </h3>
          <ol className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-blue-800'} space-y-1 list-decimal list-inside`}>
            <li>Open WhatsApp and go to the chat you want to export</li>
            <li>Tap the three dots menu → More → Export chat</li>
            <li>Select "Include Media" when prompted</li>
            <li>Save the ZIP file and upload it here</li>
          </ol>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed ${isDark ? 'border-whatsapp-border hover:border-whatsapp-teal' : 'border-gray-300 hover:border-whatsapp-teal'} rounded-xl p-8 text-center cursor-pointer transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {file ? (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-whatsapp-teal/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-whatsapp-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className={`font-semibold ${isDark ? 'text-whatsapp-text-primary' : 'text-gray-900'} mb-1`}>
                {file.name}
              </p>
              <p className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-gray-600'}`}>
                {formatSize(file.size)}
              </p>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-whatsapp-teal/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-whatsapp-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className={`font-semibold ${isDark ? 'text-whatsapp-text-primary' : 'text-gray-900'} mb-1`}>
                Click to select ZIP file
              </p>
              <p className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-gray-600'}`}>
                or drag and drop
              </p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-gray-600'}`}>
                Uploading and processing...
              </span>
              <span className={`text-sm font-semibold ${isDark ? 'text-whatsapp-text-primary' : 'text-gray-900'}`}>
                {progress}%
              </span>
            </div>
            <div className={`h-2 ${isDark ? 'bg-whatsapp-bg' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-whatsapp-teal transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${isDark ? 'bg-whatsapp-hover hover:bg-whatsapp-border text-whatsapp-text-primary' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 bg-whatsapp-teal hover:bg-whatsapp-secondary text-white px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
