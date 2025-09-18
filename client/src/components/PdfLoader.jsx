import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

const PdfLoader = ({ url, beforeLoad, onError, children }) => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let pdfDocumentInstance = null;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load the PDF document
        const pdfDoc = await pdfjs.getDocument({
          url,
          verbosity: 0
        }).promise;
        
        pdfDocumentInstance = pdfDoc;
        
        if (isMounted) {
          setPdfDocument(pdfDoc);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
          setError(err.message);
          if (onError) {
            onError(`Failed to load PDF: ${err.message}`);
          }
        }
      }
    };

    if (url) {
      loadPdf();
    }

    // Cleanup function to destroy the PDF document and prevent memory leaks
    return () => {
      isMounted = false;
      if (pdfDocumentInstance) {
        try {
          // Destroy the PDF document to free up resources
          pdfDocumentInstance.destroy();
        } catch (err) {
          console.warn('Error destroying PDF document:', err);
        }
      }
    };
  }, [url, onError]);

  // Render error state with explicit error message
  if (error) {
    return <div className="pdf-loader-error">Error loading PDF: {error}</div>;
  }

  // Render loading state
  if (loading || !pdfDocument) {
    return beforeLoad;
  }

  // Render children with the loaded PDF document
  return children(pdfDocument);
};

export default PdfLoader;