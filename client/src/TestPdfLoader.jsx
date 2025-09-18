import React from "react";
import PdfLoader from "./components/PdfLoader";

const TestPdfLoader = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", padding: "20px" }}>
      <h1>PDF Loader Test</h1>
      <PdfLoader
        url="http://localhost:5001/uploads/test.pdf"
        beforeLoad={<div>Loading PDF...</div>}
        onError={(error) => console.error("PDF Load Error:", error)}
      >
        {(pdfDocument) => (
          <div>
            <h2>PDF Loaded Successfully!</h2>
            <p>Page Count: {pdfDocument.numPages}</p>
          </div>
        )}
      </PdfLoader>
    </div>
  );
};

export default TestPdfLoader;
