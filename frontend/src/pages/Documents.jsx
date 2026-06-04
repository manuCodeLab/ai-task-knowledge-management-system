import React from "react";
import { useEffect, useState } from "react";
import UploadDocument from "../components/UploadDocument.jsx";
import { api, getSessionUser } from "../services/api.js";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const user = getSessionUser();

  async function loadDocuments() {
    setError("");
    try {
      const { data } = await api.get("/documents");
      setDocuments(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load documents");
    } finally {
      setLoading(false);
    }
  }

  async function downloadDocument(document) {
    setError("");
    setDownloadingId(document.id);
    try {
      const { data } = await api.get(`/documents/${document.id}/download`, {
        responseType: "blob",
        timeout: 60000,
      });
      if (data.type?.includes("application/json")) {
        const message = JSON.parse(await data.text()).detail;
        throw new Error(message || "Could not download document");
      }
      const url = URL.createObjectURL(data);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.title || "document.pdf";
      link.style.display = "none";
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        try {
          const message = JSON.parse(await err.response.data.text()).detail;
          setError(message || "Could not download document");
          return;
        } catch {
          setError("Could not download document");
          return;
        }
      }
      setError(err.message || err.response?.data?.detail || "Could not download document");
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <h1>Documents</h1>
      </div>
      {user?.role === "admin" && <UploadDocument onUploaded={loadDocuments} />}
      {loading && <p className="muted">Loading documents...</p>}
      {error && <p className="error task-error">{error}</p>}
      <div className="list">
        {documents.map((document) => (
          <article className="card" key={document.id}>
            <h3>{document.title}</h3>
            <p>{document.file_path}</p>
            <span>
              {document.file_size
                ? `${Math.ceil(document.file_size / 1024)} KB available`
                : "Needs re-upload after backend redeploy"}
            </span>
            <span>Uploaded by user #{document.uploaded_by}</span>
            <div className="card-actions">
              <button
                disabled={downloadingId === document.id}
                onClick={() => downloadDocument(document)}
              >
                {downloadingId === document.id ? "Downloading..." : "Download"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
