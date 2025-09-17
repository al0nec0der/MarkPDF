import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PdfHighlighter, Tip } from 'react-pdf-highlighter';
import { getFileByUuid, getHighlights, saveHighlight } from '../services/api';

function ViewerPage() {
  const { pdfUuid } = useParams();
  const [pdfFile, setPdfFile] = useState(null);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchPdfAndHighlights = async () => {
      try {
        const fileRes = await getFileByUuid(pdfUuid);
        setPdfFile(fileRes.data);
        const highlightsRes = await getHighlights(pdfUuid);
        setHighlights(highlightsRes.data);
      } catch (error) {
        console.error('Failed to fetch PDF and highlights', error);
      }
    };
    fetchPdfAndHighlights();
  }, [pdfUuid]);

  const handleSaveHighlight = async (highlight) => {
    try {
      const saved = await saveHighlight({ ...highlight, pdfUuid });
      setHighlights([...highlights, saved.data]);
    } catch (error) {
      console.error('Failed to save highlight', error);
    }
  };

  if (!pdfFile) {
    return <div>Loading...</div>;
  }

  const pdfUrl = `http://localhost:5001/uploads/${pdfFile.filename}`;

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <PdfHighlighter
        url={pdfUrl}
        highlights={highlights}
        onSelectionFinished={(highlight) => (
          <Tip
            onConfirm={() => handleSaveHighlight(highlight)}
          />
        )}
      />
    </div>
  );
}

export default ViewerPage;
