import React, { useState, useEffect } from 'react';
import newRequest from '../utils/newRequest';
import Navbar from '../Components/Navbar';
import './AllFiles.scss'; // Import the new CSS file

const AllFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await newRequest.get(`/Files/all`); // Correct endpoint
        setFiles(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleOpenFile = async (fileId) => {
    try {
      const response = await newRequest.get(`/Files/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await newRequest.get(`/Files/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="all-files">
      <Navbar />
      <div className="files-container">
        <h2>All Files</h2>
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-card">
              <h3>{file.title}</h3>
              <p>{file.university}</p>
              <p>{file.category}</p>
              <button onClick={() => handleOpenFile(file.id)}>Open</button>
              <button onClick={() => handleDownload(file.id, file.fileName)}>Download</button>
            </div>
          ))
        ) : (
          <p>No files found.</p>
        )}
      </div>
    </div>
  );
}

export default AllFiles;
