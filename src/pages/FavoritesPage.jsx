import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { metClient } from "../api/metClient";
import { useFavorites } from "../context/FavoritesContext";
import { BsHeartFill } from "react-icons/bs";

function FavoritesPage() {
  const { favorites } = useFavorites();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const promises = favorites.map((id) =>
        metClient.get(`/objects/${id}`).catch(() => null)
      );
      const res = await Promise.all(promises);
      const ok = res.filter((r) => r !== null && r?.data).map((r) => r.data);
      setObjects(ok);
      setLoading(false);
    };

    if (favorites.length) run();
    else setObjects([]);
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold font-serif flex items-center gap-3">
        <BsHeartFill className="text-red-500" />
        Favorite Collection
      </h1>

      {!favorites.length && <p className="mt-2 text-sm text-gray-500">Belum ada karya favorit.</p>}
      {loading && <p className="mt-2 text-sm text-gray-500">Memuat…</p>}

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {objects.map((o) => (
          <Link
            key={o.objectID}
            to={`/art/${o.objectID}`}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
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
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;