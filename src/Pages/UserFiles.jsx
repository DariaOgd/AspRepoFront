import React, { useState, useEffect } from 'react';
import newRequest from '../utils/newRequest';
import { useParams } from 'react-router-dom';
import './UserFiles.scss';
import Navbar2 from '../Components/Navbar2';

const UserFiles = () => {
  const { userId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await newRequest.get(`/Files/user/${userId}`);
        setFiles(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

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
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await newRequest.delete(`/Files/${fileId}`);
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-files">
      <Navbar2/>
      <h2 id="heading-2">Your Files</h2>
      <div className="files-container">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-card">
              <h3>{file.title}</h3>
              <p>{file.university}</p>
              <p>{file.category}</p>
              <button onClick={() => handleOpenFile(file.id)}>Open</button>
              <button onClick={() => handleDownload(file.id, file.fileName)}>Download</button>
              <button onClick={() => handleDelete(file.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No files found.</p>
        )}
      </div>
    </div>
  );
}

export default UserFiles;
