import { Search } from "lucide-react";
import React from "react";
import { useState } from "react";

export default function SearchBox({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  function submit(event) {
    event.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form className="search-box" onSubmit={submit}>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search knowledge documents"
      />
      <button disabled={loading}>
        <Search size={18} /> Search
      </button>
    </form>
  );
}
