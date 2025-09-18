import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { PdfHighlighter, PdfLoader } from "react-pdf-highlighter";
import Tip from "../components/Tip";
import { getFileByUuid, getHighlights, saveHighlight } from "../services/api";
import "react-pdf-highlighter/dist/esm/style/PdfHighlighter.css";

// Configure the PDF.js worker locally
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function ViewerPage() {
  const { pdfUuid } = useParams();
  const navigate = useNavigate();

  // Essential states only
  const [url, setUrl] = useState('');
  const [highlights, setHighlights] = useState([]);

  // Single useEffect hook that runs when pdfUuid changes
  useEffect(() => {
    const fetchData = async () => {
      if (!pdfUuid) return;

      try {
        // First API call: get PDF metadata
        const fileResponse = await getFileByUuid(pdfUuid);
        if (fileResponse.data && fileResponse.data.filename) {
          const fullUrl = `http://localhost:5001/uploads/${fileResponse.data.filename}`;
          setUrl(fullUrl);
        }

        // Second API call: get highlights
        const highlightsResponse = await getHighlights(pdfUuid);
        const highlightsData = highlightsResponse.data || highlightsResponse;
        setHighlights(Array.isArray(highlightsData) ? highlightsData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [pdfUuid]);

  // Re-implement the addHighlight function as a simple async function
  const addHighlight = useCallback(async (newHighlight) => {
    try {
      // Call the saveHighlight API service
      const response = await saveHighlight({
        ...newHighlight,
        pdfUuid,
        timestamp: new Date().toISOString()
      });
      
      // On success, update the highlights state by adding the server's response
      setHighlights(prevHighlights => [...prevHighlights, response.data]);
    } catch (error) {
      console.error("Failed to save highlight:", error);
    }
  }, [pdfUuid]);

  // Highlight transform function
  const highlightTransform = useCallback(
    (
      highlight,
      index,
      setTip,
      hideTip,
      viewportToScaled,
      screenshot,
      isScrolledTo
    ) => {
      const component = (
        <div
          className="PdfHighlighter__highlight"
          style={{
            backgroundColor: isScrolledTo
              ? "rgb(255, 226, 143)"
              : "rgba(255, 226, 143, 0.4)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={() => {
            setTip(highlight, (highlight) => (
              <div className="Highlight__popup">
                <div className="Highlight__popup-content">
                  {highlight.content?.text || "Area highlight"}
                </div>
                {highlight.content?.image && (
                  <img
                    src={highlight.content.image}
                    alt="Highlight screenshot"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                )}
                <div className="Highlight__popup-timestamp">
                  {highlight.timestamp
                    ? new Date(highlight.timestamp).toLocaleString()
                    : ""}
                </div>
              </div>
            ));
          }}
          onMouseOut={hideTip}
        />
      );

      return component;
    },
    []
  );

  // Enable area selection
  const enableAreaSelection = useCallback((event) => {
    return event.altKey;
  }, []);

  // Scroll ref
  const scrollRef = useCallback(() => {
    return window;
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">PDF Viewer</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <div
          className="PdfHighlighter mx-auto bg-white shadow-lg rounded-lg"
          style={{
            width: "100%",
            height: "calc(100vh - 120px)",
            maxWidth: "1200px",
          }}
        >
          <PdfLoader
            url={url}
            beforeLoad={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            }
          >
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                highlights={highlights}
                highlightTransform={highlightTransform}
                onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => (
                  <Tip
                    onConfirm={(comment) => {
                      // Create highlight object with position, content, and comment
                      const highlight = {
                        position,
                        content: {
                          ...content,
                          text: comment.text || content?.text || ''
                        },
                        comment
                      };
                      
                      // Call the addHighlight function
                      addHighlight(highlight);
                      
                      // Hide the tip popup
                      hideTipAndSelection();
                    }}
                  />
                )}
                enableAreaSelection={enableAreaSelection}
                scrollRef={scrollRef}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    </div>
  );
}

export default ViewerPage;