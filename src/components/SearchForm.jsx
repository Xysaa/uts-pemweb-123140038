import React, { useEffect, useState } from "react";
import axios from "axios";
// + Impor ikon
import { FiSearch, FiRotateCcw } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_MET_API_BASE ?? "https://collectionapi.metmuseum.org/public/collection/v1";
const API_KEY = import.meta.env.VITE_MET_API_KEY || "";

export default function SearchForm({ onSearch }) {
  const [q, setQ] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [hasImages, setHasImages] = useState(true);
  const [isHighlight, setIsHighlight] = useState(false);
  const [loadingDeps, setLoadingDeps] = useState(false);

  useEffect(() => {
    const client = axios.create({
      baseURL: API_BASE,
      headers: API_KEY ? { "x-api-key": API_KEY } : undefined,
    });
    const run = async () => {
      try {
        setLoadingDeps(true);
        const { data } = await client.get("/departments");
        setDepartments(data?.departments || []);
      } catch {
        setDepartments([]);
      } finally {
        setLoadingDeps(false);
      }
    };
    run();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      q,
      departmentId: departmentId ? Number(departmentId) : undefined,
      dateBegin: dateBegin ? Number(dateBegin) : undefined,
      dateEnd: dateEnd ? Number(dateEnd) : undefined,
      hasImages,
      isHighlight,
    };
    onSearch?.(payload);
  };

  const clearFilters = () => {
    setQ("");
    setDepartmentId("");
    setDateBegin("");
    setDateEnd("");
    setHasImages(true);
    setIsHighlight(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Keyword</label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="contoh: van gogh, sword, egypt, landscape…"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
          >
            <option value="">{loadingDeps ? "Memuat…" : "Semua Department"}</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm mb-1">Year From</label>
          <input
            type="number"
            inputMode="numeric"
            value={dateBegin}
            onChange={(e) => setDateBegin(e.target.value)}
            placeholder="e.g., 1500"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Year To</label>
          <input
            type="number"
            inputMode="numeric"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            placeholder="e.g., 1900"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasImages}
            onChange={(e) => setHasImages(e.target.checked)}
            className="rounded"
          />
          Hanya yang ada gambar
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isHighlight}
            onChange={(e) => setIsHighlight(e.target.checked)}
            className="rounded"
          />
          Highlighted
        </label>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-100 dark:text-black dark:hover:bg-white transition-colors flex items-center gap-2"
        >
          <FiSearch className="w-4 h-4" />
          Search
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FiRotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </form>
  );
}