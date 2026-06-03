import { useState } from "react";
import SearchBox from "../components/SearchBox.jsx";
import { api } from "../services/api.js";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search(query) {
    setLoading(true);
    try {
      const { data } = await api.post("/search", { query, top_k: 5 });
      setResults(data.results);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Search</h1>
      </div>
      <SearchBox onSearch={search} loading={loading} />
      <div className="list">
        {results.map((result, index) => (
          <article className="card" key={`${result.document_id}-${index}`}>
            <h3>{result.title || "Document chunk"}</h3>
            <p>{result.chunk}</p>
            {result.score !== null && <span>Score {result.score.toFixed(3)}</span>}
          </article>
        ))}
      </div>
    </section>
  );
}
