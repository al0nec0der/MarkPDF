import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserFiles, uploadFile } from '../services/api';

function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const { data } = await getUserFiles();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    try {
      await uploadFile(formData);
      fetchFiles(); // Refresh file list
      setSelectedFile(null);
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
        <h3>Your Files</h3>
        <ul>
          {files.map((file) => (
            <li key={file.uuid}>
              <Link to={`/pdf/${file.uuid}`}>{file.originalname}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
