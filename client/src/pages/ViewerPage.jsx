import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { PdfHighlighter, PdfLoader } from "react-pdf-highlighter";
import Tip from "../components/Tip";
import Sidebar from "../components/Sidebar";
import { getFileByUuid, getHighlights, saveHighlight } from "../services/api";

// Configure the PDF.js worker locally
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function ViewerPage() {
  const { pdfUuid } = useParams();
  const navigate = useNavigate();

  // Essential states only
  const [url, setUrl] = useState('');
  const [highlights, setHighlights] = useState([]);

  // Debug useEffect to monitor highlights changes
  useEffect(() => {
    console.log('Highlights state updated:', highlights);
    console.log('Number of highlights:', highlights.length);
  }, [highlights]);

  // Single useEffect hook that runs when pdfUuid changes
  useEffect(() => {
    const fetchData = async () => {
      if (!pdfUuid) return;

      try {
        // First API call: get PDF metadata
        const fileResponse = await getFileByUuid(pdfUuid);
        if (fileResponse.data && fileResponse.data.filename) {
          const fullUrl = `http://localhost:5001/uploads/${fileResponse.data.filename}`;
          console.log('PDF URL:', fullUrl); // Debug log
          setUrl(fullUrl);
        }

        // Second API call: get highlights
        const highlightsResponse = await getHighlights(pdfUuid);
        const highlightsData = highlightsResponse.data || highlightsResponse;
        console.log('Raw highlights data:', highlightsData); // Debug log
        
        // Validate highlights format to match agentcooper schema
        const validateHighlight = (highlight) => {
          return (
            highlight &&
            typeof highlight.id === 'string' &&
            highlight.content &&
            typeof highlight.content.text === 'string' &&
            highlight.position &&
            typeof highlight.position.pageNumber === 'number' &&
            highlight.position.boundingRect &&
            typeof highlight.position.boundingRect.x1 === 'number' &&
            typeof highlight.position.boundingRect.y1 === 'number' &&
            typeof highlight.position.boundingRect.x2 === 'number' &&
            typeof highlight.position.boundingRect.y2 === 'number' &&
            typeof highlight.position.boundingRect.width === 'number' &&
            typeof highlight.position.boundingRect.height === 'number' &&
            Array.isArray(highlight.position.rects) &&
            highlight.comment &&
            typeof highlight.comment.text === 'string' &&
            typeof highlight.comment.emoji === 'string'
          );
        };
        
        const formattedHighlights = Array.isArray(highlightsData) ? highlightsData : [];
        console.log('Formatted highlights array:', formattedHighlights); // Debug log
        console.log('Valid highlights:', formattedHighlights.filter(validateHighlight)); // Debug log
        
        // Ensure all highlights have the required structure
        const normalizedHighlights = formattedHighlights.map(highlight => ({
          id: highlight.id || Math.random().toString(36).substr(2, 9),
          content: {
            text: highlight.content?.text || ''
          },
          position: {
            boundingRect: highlight.position?.boundingRect || { 
              x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 
            },
            rects: Array.isArray(highlight.position?.rects) ? highlight.position.rects : [],
            pageNumber: highlight.position?.pageNumber || 1
          },
          comment: {
            text: highlight.comment?.text || '',
            emoji: highlight.comment?.emoji || ''
          }
        }));
        
        setHighlights(normalizedHighlights);
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
      
      // Ensure the response has the correct format
      const formattedHighlight = {
        id: response.data?.id || Math.random().toString(36).substr(2, 9),
        content: {
          text: response.data?.content?.text || newHighlight.content?.text || ''
        },
        position: {
          boundingRect: response.data?.position?.boundingRect || newHighlight.position?.boundingRect || { 
            x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 
          },
          rects: Array.isArray(response.data?.position?.rects) ? response.data.position.rects : 
                 Array.isArray(newHighlight.position?.rects) ? newHighlight.position.rects : [],
          pageNumber: response.data?.position?.pageNumber || newHighlight.position?.pageNumber || 1
        },
        comment: {
          text: response.data?.comment?.text || newHighlight.comment?.text || '',
          emoji: response.data?.comment?.emoji || newHighlight.comment?.emoji || ''
        }
      };
      
      // On success, update the highlights state by adding the server's response
      setHighlights(prevHighlights => [...prevHighlights, formattedHighlight]);
    } catch (error) {
      console.error("Failed to save highlight:", error);
    }
  }, [pdfUuid]);

  // Scroll ref
  const scrollRef = useCallback(() => {
    // Return the scrollable container element (the viewer div)
    return document.querySelector('.viewer');
  }, []);

  // Scroll to highlight function
  const scrollToHighlight = useCallback((highlight) => {
    // This function will be called when a user clicks on a highlight in the sidebar
    // In a complete implementation, this would scroll the PDF viewer to the highlight location
    console.log('Highlight clicked in sidebar:', highlight);
    // TODO: Implement scrolling to the highlight location in the PDF
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#181818] overflow-hidden">
      {/* Sidebar - fixed width */}
      <div className="w-80 flex-shrink-0 bg-[#181818] overflow-y-auto overflow-x-hidden">
        <Sidebar 
          highlights={highlights} 
          scrollToHighlight={scrollToHighlight} 
        />
      </div>
      
      {/* PDF Viewer Panel - takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden viewer">
          <div className="min-h-full flex justify-center items-start">
            <div className="bg-white shadow-[0_0_16px_#0001] rounded-xl w-full max-w-[850px] m-4">
              <PdfLoader
                url={url}
                beforeLoad={
                  <div className="flex items-center justify-center h-full min-h-[500px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                }
              >
                {(pdfDocument) => (
                  console.log('PdfHighlighter rendering with highlights:', highlights), // Debug log
                  <div className="w-full overflow-x-hidden">
                    <PdfHighlighter
                      pdfDocument={pdfDocument}
                      highlights={highlights}
                      onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => (
                        <Tip
                          onConfirm={(comment) => {
                            // Create highlight object with position, content, and comment
                            const highlight = {
                              position,
                              content: {
                                ...content,
                                text: content?.text || ''
                              },
                              comment: {
                                text: comment.text || '',
                                emoji: ''
                              }
                            };
                            
                            // Call the addHighlight function
                            addHighlight(highlight);
                            
                            // Hide the tip popup
                            hideTipAndSelection();
                          }}
                        />
                      )}
                      onHighlightClicked={(highlight) => {
                        console.log('Highlight clicked:', highlight);
                        scrollToHighlight(highlight);
                      }}
                      scrollRef={scrollRef}
                    />
                  </div>
                )}
              </PdfLoader>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewerPage;