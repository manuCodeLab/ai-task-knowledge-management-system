import React from "react";
import { useEffect, useState } from "react";
import UploadDocument from "../components/UploadDocument.jsx";
import { api, getSessionUser } from "../services/api.js";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    const { data } = await api.get(`/documents/${document.id}/download`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(data);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.title;
    link.click();
    URL.revokeObjectURL(url);
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
            <span>Uploaded by user #{document.uploaded_by}</span>
            <div className="card-actions">
              <button onClick={() => downloadDocument(document)}>Download</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
