import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { PdfHighlighter } from "react-pdf-highlighter";
import { getFileByUuid, saveHighlight, getHighlights } from "../services/api";
import "react-pdf-highlighter/dist/style.css";
import "../styles/pdf-highlighter.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
function ViewerPage() {
  const { pdfUuid } = useParams();
  const navigate = useNavigate();

  // State
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [highlights, setHighlights] = useState([]);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const previousScaleRef = useRef(1.0);
  const scrollPositionRef = useRef({ x: 0, y: 0 });

  const handleGoToDashboard = useCallback(() => navigate("/"), [navigate]);

  const zoomIn = useCallback(
    () => setScale((prev) => Math.min(prev + 0.2, 3)),
    []
  );
  const zoomOut = useCallback(
    () => setScale((prev) => Math.max(prev - 0.2, 0.5)),
    []
  );
  const resetZoom = useCallback(() => setScale(1.0), []);

  // Highlight handlers
  const handleHighlightClick = useCallback((highlight) => {
    setSelectedHighlight(highlight);
  }, []);

  const addHighlight = useCallback(
    async (highlight) => {
      try {
        const savedHighlight = await saveHighlight({
          ...highlight,
          pdfUuid,
          timestamp: new Date().toISOString(),
        });
        setHighlights((prev) => [...prev, savedHighlight]);
        setSelectedHighlight(savedHighlight);
      } catch (error) {
        console.error("Failed to save highlight:", error);
      }
    },
    [pdfUuid]
  );

  // Load highlights
  useEffect(() => {
    const loadHighlights = async () => {
      if (!pdfUuid) return;
      try {
        const response = await getHighlights(pdfUuid);
        const data = response.data || response; // Handle both response.data and direct response
        setHighlights(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load highlights:", error);
        setHighlights([]); // Ensure highlights is always an array
      }
    };
    loadHighlights();
  }, [pdfUuid]);

  // Fetch PDF
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const fileRes = await getFileByUuid(pdfUuid);
        setPdfFile(fileRes.data);

        if (!fileRes.data || !fileRes.data.filename) {
          throw new Error("Invalid file metadata received");
        }

        // Construct absolute URL for the PDF file
        const url = `http://localhost:5001/uploads/${fileRes.data.filename}`;
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

  // Load PDF document
  useEffect(() => {
    let isMounted = true;
    let currentPdfDoc = null;
    let loadingTask = null;

    const loadPdfDocument = async () => {
      if (!pdfUrl) return;

      try {
        // Cancel any existing loading task
        if (loadingTask) {
          loadingTask.destroy();
        }

        console.log("Loading PDF from URL:", pdfUrl);

        // Create new loading task
        loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          verbosity: 1, // Increase verbosity for debugging
          cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
          cMapPacked: true,
          enableXfa: true,
          disableAutoFetch: false,
          disableStream: false,
        });

        console.log("PDF loading task created");
        const pdfDoc = await loadingTask.promise;
        console.log("PDF document loaded:", pdfDoc.numPages, "pages");

        // Verify the PDF has loaded properly
        if (!pdfDoc || pdfDoc.numPages === 0) {
          throw new Error("PDF document loaded but contains no pages");
        }

        currentPdfDoc = pdfDoc;

        if (isMounted) {
          console.log("Setting PDF document in state");
          setPdfDocument(pdfDoc);
          setError(null); // Clear any previous errors
        }
      } catch (error) {
        if (isMounted) {
          if (error.name === "RenderingCancelledException") {
            console.warn("PDF rendering cancelled, retrying...");
            // Add a small delay before retrying
            setTimeout(loadPdfDocument, 100);
          } else {
            console.error("Failed to load PDF document", error);
            setError(`Failed to load PDF document: ${error.message}`);
          }
        }
      }
    };

    loadPdfDocument();

    return () => {
      isMounted = false;
      if (loadingTask) {
        loadingTask.destroy();
      }
      if (currentPdfDoc) {
        currentPdfDoc.destroy();
      }
    };
  }, [pdfUrl]);

  // Save scroll position before zoom change
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        scrollPositionRef.current = {
          x: scrollContainerRef.current.scrollLeft,
          y: scrollContainerRef.current.scrollTop,
        };
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Adjust scroll position after zoom change
  useEffect(() => {
    if (!scrollContainerRef.current || !containerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const currentScale = scale;

    // Get the scroll container's dimensions
    const containerWidth = scrollContainer.clientWidth;
    const containerHeight = scrollContainer.clientHeight;

    // Get the current scroll position as a percentage of the total scrollable area
    const scrollXPercent =
      scrollContainer.scrollLeft /
      (scrollContainer.scrollWidth - containerWidth);
    const scrollYPercent =
      scrollContainer.scrollTop /
      (scrollContainer.scrollHeight - containerHeight);

    // Wait for the next frame to ensure the scale transformation has been applied
    requestAnimationFrame(() => {
      // Calculate new scroll positions maintaining the same relative position
      const newScrollLeft =
        (scrollContainer.scrollWidth - containerWidth) * scrollXPercent;
      const newScrollTop =
        (scrollContainer.scrollHeight - containerHeight) * scrollYPercent;

      // Apply the new scroll positions
      scrollContainer.scrollLeft = newScrollLeft;
      scrollContainer.scrollTop = newScrollTop;
    });

    // Update previous scale
    previousScaleRef.current = currentScale;
  }, [scale]);

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
          onClick={(e) => {
            e.stopPropagation();
            handleHighlightClick(highlight);
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
    [handleHighlightClick]
  );

  // Enable area selection
  const enableAreaSelection = useCallback((event) => {
    return event.altKey;
  }, []);

  // Scroll ref
  const scrollRef = useCallback(() => {
    return scrollContainerRef.current;
  }, []);

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
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{pdfFile?.originalname}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={resetZoom}
              className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {selectedHighlight && (
            <div className="bg-yellow-100 px-4 py-2 rounded-md">
              Selected: {selectedHighlight.content?.text || "Area highlight"}
            </div>
          )}
          <button
            onClick={handleGoToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <div
          ref={containerRef}
          className="PdfHighlighter mx-auto bg-white shadow-lg rounded-lg"
          style={{
            width: "100%",
            height: "calc(100vh - 120px)", // Account for header and padding
            maxWidth: "1200px",
          }}
        >
          {pdfDocument && (
            <div
              ref={scrollContainerRef}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "auto",
                backgroundColor: "#fafafa",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  transform: `scale(${scale})`,
                  transformOrigin: "center top",
                  padding: "20px",
                }}
              >
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={enableAreaSelection}
                  highlights={Array.isArray(highlights) ? highlights : []}
                  onSelectionFinished={addHighlight}
                  highlightTransform={highlightTransform}
                  scrollRef={scrollRef}
                  pdfScaleValue="page-width"
                  onDocumentReady={() => {
                    console.log("PDF document ready");
                  }}
                  onDocumentError={(error) => {
                    console.error("PDF document error:", error);
                    setError(`Failed to render PDF: ${error.message}`);
                  }}
                  renderingCancelled={(error) => {
                    console.warn("Rendering cancelled:", error);
                    return true; // Allow retry
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewerPage;
