import { Upload } from "lucide-react";
import React from "react";
import { useState } from "react";
import { api } from "../services/api.js";

export default function UploadDocument({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await api.post("/documents/upload", formData);
      setFile(null);
      event.target.reset();
      onUploaded?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="toolbar" onSubmit={submit}>
      <input type="file" accept=".txt" onChange={(event) => setFile(event.target.files[0])} />
      <button disabled={!file || loading}>
        <Upload size={18} /> {loading ? "Uploading" : "Upload"}
      </button>
    </form>
  );
}
