import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { metClient, API_BASE } from "../api/metClient";
import SearchForm from "../components/SearchForm";
import { useFavorites } from "../context/FavoritesContext";
import { BsHeart, BsHeartFill, BsChevronLeft, BsChevronRight } from "react-icons/bs";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [objectIDs, setObjectIDs] = useState([]);
  const [objects, setObjects] = useState([]);
  const [error, setError] = useState("");
  
  // + Ambil data favorites
  const { favorites, toggleFavorite } = useFavorites();

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchObjectsByIDs = async (ids = []) => {
    const start = (page - 1) * pageSize;
    const slice = ids.slice(start, start + pageSize);

    const promises = slice.map((id) =>
      metClient
        .get(`/objects/${id}`)
        .catch(() => null)
    );

    const results = await Promise.all(promises);
    const ok = results
      .filter((r) => r !== null && r?.data)
      .map((r) => r.data)
      .filter((o) => o?.primaryImageSmall || o?.primaryImage);

    setObjects(ok);
  };

  useEffect(() => {
    if (objectIDs.length) {
      fetchObjectsByIDs(objectIDs);
    } else {
      setObjects([]);
    }

  }, [objectIDs, page]);

  const handleSearch = async ({ q, departmentId, dateBegin, dateEnd, isHighlight, hasImages }) => {
    try {
      setError("");
      setLoading(true);
      setObjects([]);
      setPage(1);

      const params = {
        q: q?.trim() || "",
        hasImages: hasImages ?? true,
      };
      if (departmentId) params.departmentId = departmentId;
      if (typeof dateBegin === "number") params.dateBegin = dateBegin;
      if (typeof dateEnd === "number") params.dateEnd = dateEnd;
      if (isHighlight) params.isHighlight = true;

      const { data } = await metClient.get("/search", { params });

      if (data?.objectIDs?.length) setObjectIDs(data.objectIDs);
      else setObjectIDs([]);
    } catch {
      setError("Gagal memuat hasil. Coba ubah kata kunci atau filter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <SearchForm onSearch={handleSearch} />

      {loading && <div className="mt-6 animate-pulse text-sm text-gray-500">Memuat hasil…</div>}
      {error && <div className="mt-6 text-sm text-red-600">{error}</div>}

      {!loading && !error && objects.length === 0 && objectIDs.length === 0 && (
        <div className="mt-6 text-sm text-gray-500">
          Mulai dengan memasukkan kata kunci atau pilih department.
        </div>
      )}

      {!loading && !error && objects.length === 0 && objectIDs.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          Tidak ada karya dengan gambar yang tersedia di halaman ini. Coba halaman lain.
        </div>
      )}

      {/* Grid preview */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {objects.map((o) => {
          const isFav = favorites.includes(o.objectID);
          
          return (
            <div
              key={o.objectID}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <Link
                to={`/art/${o.objectID}`}
                className="block w-full text-left"
                title={o.title}
              >
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={o.primaryImageSmall || o.primaryImage}
                    alt={o.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2 font-serif">
                    {o.title || "Untitled"}
                  </p>
                  {o.artistDisplayName && (
                    <p className="mt-1 text-xs text-gray-500">{o.artistDisplayName}</p>
                  )}
                </div>
              </Link>

              <div className="px-3 pb-3 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    toggleFavorite(o.objectID);
                  }}
                  className={`w-full text-sm px-3 py-2 rounded-lg border flex items-center justify-center gap-2 ${
                    isFav
                      ? "bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-500"
                      : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {isFav ? <BsHeartFill /> : <BsHeart />}
                  {isFav ? "Favorited" : "Favorite"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {objectIDs.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous Page"
          >
            <BsChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm">
            Page {page} / {Math.ceil(objectIDs.length / pageSize)}
          </span>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setPage((p) => (p * pageSize < objectIDs.length ? p + 1 : p))}
            disabled={page * pageSize >= objectIDs.length}
            aria-label="Next Page"
          >
            <BsChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;