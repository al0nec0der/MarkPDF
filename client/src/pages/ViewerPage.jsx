import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { getFileByUuid } from "../services/api";

// Set worker source directly to the public directory
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function ViewerPage() {
  const { pdfUuid } = useParams();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Start on page 1

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        console.log("Fetching PDF with UUID:", pdfUuid);
        setLoading(true);
        // First get file metadata
        const fileRes = await getFileByUuid(pdfUuid);
        console.log("File metadata response:", fileRes);
        console.log("File metadata data:", fileRes.data);
        setPdfFile(fileRes.data);

        // Check if we have the required data
        if (!fileRes.data || !fileRes.data.filename) {
          throw new Error("Invalid file metadata received");
        }

        // Create URL to access the file directly from uploads directory
        const url = `http://localhost:5001/uploads/${fileRes.data.filename}`;
        console.log("PDF URL:", url);
        setPdfUrl(url);
      } catch (error) {
        console.error("Failed to fetch PDF", error);
        setError(`Failed to load PDF file: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPdf();
  }, [pdfUuid]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document load
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleGoToDashboard = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading PDF...
      </div>
    );
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
  if (!pdfUrl.startsWith("http://localhost:5001/uploads/")) {
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
      <div className="flex-1 flex justify-center items-center overflow-auto p-4">
        <div className="w-full max-w-4xl bg-gray-100 shadow-lg rounded-lg overflow-hidden">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) =>
              setError(`Failed to load PDF document: ${error.message}`)
            }
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>
          {numPages && (
            <div className="flex justify-center items-center p-4 bg-white border-t">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <p>
                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
              </p>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
                className="px-4 py-2 ml-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewerPage;
