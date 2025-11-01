import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { metClient } from "../api/metClient";
import { useFavorites } from "../context/FavoritesContext";
// + Impor ikon
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";

function DetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(Number(id));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        setLoading(true);
        const { data } = await metClient.get(`/objects/${id}`);
        setData(data);
      } catch (err) {
        if (err.response?.status === 404) setError("Karya tidak ditemukan atau sudah tidak tersedia.");
        else setError("Gagal memuat detail karya.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) {
    return <div className="max-w-5xl mx-auto p-4 md:p-6 text-sm text-gray-500">Memuat detail…</div>;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <Link to="/" className="text-sky-600 hover:underline">← Kembali ke beranda</Link>
      </div>
    );
  }

  if (!data) {
    return <div className="max-w-5xl mx-auto p-4 md:p-6 text-sm text-gray-500">Data tidak tersedia.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* PERUBAHAN: Layout diubah dari 2 kolom (1:1) menjadi 5 kolom (3:2) */}
      <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
        
        <div className="md:col-span-3 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          {(data.primaryImage || data.primaryImageSmall) ? (
            <img
              src={data.primaryImage || data.primaryImageSmall}
              alt={data.title}
              className="w-full h-auto"
            />
          ) : (
            <div className="aspect-[3/4] flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-serif font-bold">{data.title}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{data.objectName}</p>

          <dl className="mt-6 border-t border-gray-200 dark:border-gray-700">
            {data.artistDisplayName && (
              <div className="py-3 flex flex-col">
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Artist</dt>
                <dd className="flex-1 text-lg font-serif mt-1">{data.artistDisplayName}</dd>
              </div>
            )}
            {data.objectDate && (
              <div className="py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col">
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Date</dt>
                <dd className="flex-1 text-lg font-serif mt-1">{data.objectDate}</dd>
              </div>
            )}
            {data.medium && (
              <div className="py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col">
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Medium</dt>
                <dd className="flex-1">{data.medium}</dd>
              </div>
            )}
            {data.culture && (
              <div className="py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col">
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Culture</dt>
                <dd className="flex-1">{data.culture}</dd>
              </div>
            )}
            {data.department && (
              <div className="py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col">
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Department</dt>
                <dd className="flex-1">{data.department}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => toggleFavorite(Number(id))}
              className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                isFav
                  ? "bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-500"
                  : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {isFav ? <BsHeartFill /> : <BsHeart />}
              {isFav ? "Remove Favorite" : "Add to Favorite"}
            </button>

            {data.objectURL && (
              <a
                href={data.objectURL}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Open on The Met
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;