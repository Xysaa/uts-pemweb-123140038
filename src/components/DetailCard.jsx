import React from "react";
import { useFavorites } from "../App";
export default function DetailCard({ data }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(data.objectID);

  const tags = Array.isArray(data.tags)
    ? data.tags.map((t) => (typeof t === "string" ? t : t.term)).filter(Boolean)
    : [];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.artistDisplayName || "",
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
        {(data.primaryImage || data.primaryImageSmall) ? (
          <img
            src={data.primaryImage || data.primaryImageSmall}
            alt={data.title}
            className="w-full h-auto"
          />
        ) : (
          <div className="aspect-[3/4] flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        {data.objectName && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{data.objectName}</p>
        )}

        <dl className="mt-4 space-y-1 text-sm">
          {data.artistDisplayName && (
            <Row label="Artist" value={
              <>
                <span>{data.artistDisplayName}</span>
                {data.artistNationality && <span className="text-gray-500"> — {data.artistNationality}</span>}
                {data.artistBeginDate || data.artistEndDate ? (
                  <span className="text-gray-500"> ({data.artistBeginDate || "?"} - {data.artistEndDate || "?"})</span>
                ) : null}
              </>
            } />
          )}
          {data.objectDate && <Row label="Date" value={data.objectDate} />}
          {data.medium && <Row label="Medium" value={data.medium} />}
          {data.culture && <Row label="Culture" value={data.culture} />}
          {data.dimensions && <Row label="Dimensions" value={data.dimensions} />}
          {data.classification && <Row label="Classification" value={data.classification} />}
          {data.department && <Row label="Department" value={data.department} />}
          {data.creditLine && <Row label="Credit" value={data.creditLine} />}
          {data.repository && <Row label="Repository" value={data.repository} />}
        </dl>

        {!!tags.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 12).map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => toggleFavorite(data.objectID)}
            className={`px-4 py-2 rounded border ${isFav ? "bg-yellow-400 text-black border-yellow-500" : "border-gray-300 dark:border-gray-700"}`}
          >
            {isFav ? "Remove Favorite" : "Add to Favorite"}
          </button>

          {data.objectURL && (
            <a
              href={data.objectURL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700"
            >
              Open on The Met
            </a>
          )}

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700"
          >
            Share
          </button>

          {(data.primaryImage || data.primaryImageSmall) && (
            <a
              href={data.primaryImage || data.primaryImageSmall}
              download
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700"
            >
              Download Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 text-gray-500">{label}</dt>
      <dd className="flex-1">{value}</dd>
    </div>
  );
}
