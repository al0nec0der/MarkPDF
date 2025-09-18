import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFileByUuid, getHighlights } from '../services/api';

function ViewerPage() {
  const { pdfUuid } = useParams();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        console.log('Fetching PDF with UUID:', pdfUuid);
        setLoading(true);
        // First get file metadata
        const fileRes = await getFileByUuid(pdfUuid);
        console.log('File metadata response:', fileRes);
        console.log('File metadata data:', fileRes.data);
        setPdfFile(fileRes.data);
        
        // Check if we have the required data
        if (!fileRes.data || !fileRes.data.filename) {
          throw new Error('Invalid file metadata received');
        }
        
        // Create URL to access the file directly from uploads directory
        const url = `http://localhost:5001/uploads/${fileRes.data.filename}`;
        console.log('PDF URL:', url);
        setPdfUrl(url);
      } catch (error) {
        console.error('Failed to fetch PDF', error);
        setError(`Failed to load PDF file: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPdf();
  }, [pdfUuid]);

  const handleGoToDashboard = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading PDF...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4">
        <p className="text-center mb-4">{error}</p>
        <div className="flex gap-2">
          <button 
            onClick={handleGoToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!pdfFile || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-center mb-4">PDF file not found.</p>
        <div className="flex gap-2">
          <button 
            onClick={handleGoToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Check if URL is valid
  if (!pdfUrl.startsWith('http://localhost:5001/uploads/')) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4">
        <p className="text-center mb-4">Invalid PDF URL: {pdfUrl}</p>
        <div className="flex gap-2">
          <button 
            onClick={handleGoToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">{pdfFile.originalname}</h1>
        <button 
          onClick={handleGoToDashboard}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="flex-1">
        <iframe 
          src={pdfUrl} 
          className="w-full h-full border-0"
          title={pdfFile.originalname}
        />
      </div>
    </div>
  );
}

export default ViewerPage;
