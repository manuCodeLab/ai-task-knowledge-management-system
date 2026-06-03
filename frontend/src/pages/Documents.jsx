import { useEffect, useState } from "react";
import UploadDocument from "../components/UploadDocument.jsx";
import { api, getSessionUser } from "../services/api.js";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const user = getSessionUser();

  async function loadDocuments() {
    const { data } = await api.get("/documents");
    setDocuments(data);
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
      <div className="list">
        {documents.map((document) => (
          <article className="card" key={document.id}>
            <h3>{document.title}</h3>
            <p>{document.file_path}</p>
            <span>Uploaded by user #{document.uploaded_by}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
