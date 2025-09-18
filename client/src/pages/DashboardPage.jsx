import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserFiles, uploadFile } from "../services/api";

function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data } = await getUserFiles();
      setFiles(data || []);
    } catch (error) {
      console.error("Failed to fetch files", error);
      // Show error to user
      alert("Failed to fetch files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh files periodically to ensure they're still available
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFiles();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    try {
      setLoading(true);
      await uploadFile(formData);
      await fetchFiles(); // Refresh file list
      setSelectedFile(null);
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Optionally remove other user info
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold px-3 py-1 rounded">
              MP
            </div>
            <h1 className="text-xl font-semibold">MarkPDF</h1>
            <span className="text-sm text-slate-500">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Actions */}
          <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Actions</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload PDF"}
              </button>

              <Link
                to="/register"
                className="block text-center text-sm text-slate-600 hover:underline"
              >
                Manage account
              </Link>
            </div>
          </aside>

          {/* Files list */}
          <section className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Files</h2>
              <div className="text-sm text-slate-500">
                {files.length} file(s)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading && files.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-500">
                  Loading files...
                </div>
              ) : files.length === 0 ? (
                <div className="col-span-full bg-white p-6 rounded shadow-sm text-center text-slate-600">
                  No files uploaded yet. Use the upload action to add PDFs.
                </div>
              ) : (
                files.map((file) => (
                  <article
                    key={file.uuid}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-slate-800">
                          <Link
                            to={`/pdf/${file.uuid}`}
                            className="hover:underline"
                          >
                            {file.originalname}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(file.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/pdf/${file.uuid}`}
                          className="text-sm px-3 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-slate-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} MarkPDF</div>
          <div>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardPage;
