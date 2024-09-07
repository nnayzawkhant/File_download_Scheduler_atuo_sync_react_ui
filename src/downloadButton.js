import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Adjust this to match your NestJS server URL



const DownloadManager = () => {
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/list`);
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch files', error);
      setMessage('Failed to fetch files');
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/download/write-url`, { url });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error writing URL');
    }
  };

  const handleManualDownload = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download`);
      setMessage(response.data);
    } catch (error) {
      setMessage('Error initiating download');
    }
  };

  const handleFileDownload = async (filename) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/${filename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download file', error);
      setMessage('Failed to download file');
    }
  };

  return (
    <div>
      <h2>Download Manager</h2>
      <form onSubmit={handleUrlSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to download"
        />
        <button type="submit">Set URL</button>
      </form>
      <button onClick={handleManualDownload}>Trigger Manual Download</button>
      <p>{message}</p>
      <h3>Downloaded Files:</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name}{' '}
            <button onClick={() => handleFileDownload(file.name)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadManager;