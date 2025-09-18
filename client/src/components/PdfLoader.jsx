// client/src/components/PdfLoader.jsx

import React, { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";

// This is the correct, robust PdfLoader component.
function PdfLoader({ url, beforeLoad, children, onError }) {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [error, setError] = useState(null);
  const onErrorRef = useRef(onError);

  // Keep the ref updated with the latest onError function
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    // Reset states when the URL prop changes to handle new documents.
    setPdfDocument(null);
    setError(null);

    if (!url) {
      return;
    }

    let isCancelled = false;

    // Configure the worker dynamically
    const setupWorker = async () => {
      try {
        // Use the CDN version to avoid local file issues
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;
        
        // Create a new loading task with proper options
        const loadingTask = pdfjs.getDocument({
          url: url,
          withCredentials: true // Handle CORS
        });

        const loadedPdfDocument = await loadingTask.promise;
        
        // Only update state if the component is still mounted
        if (!isCancelled) {
          setPdfDocument(loadedPdfDocument);
        }
      } catch (err) {
        // Only update state if the component is still mounted
        if (!isCancelled) {
          const errorMessage = `Failed to load PDF document: ${err.message}`;
          setError(errorMessage);
          // Propagate the error to the parent if a callback is provided.
          if (onErrorRef.current) {
            onErrorRef.current(errorMessage);
          }
        }
      }
    };

    setupWorker();

    // Cleanup function - only cancel the loading task, don't destroy it
    return () => {
      isCancelled = true;
    };
  }, [url]); // Rerun this effect only if the URL changes.

  // Render logic:
  if (error) {
    // 1. If there's an error, display it.
    return <div style={{ color: "red", padding: "20px" }}>{error}</div>;
  }

  if (!pdfDocument) {
    // 2. If the document isn't loaded yet, show the loading indicator.
    return beforeLoad;
  }

  // 3. If everything is successful, call the children render prop with the document.
  return children(pdfDocument);
}

export default PdfLoader;