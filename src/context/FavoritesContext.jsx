import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("met:favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("met:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (objectID) => {
    setFavorites((prev) =>
      prev.includes(objectID) ? prev.filter((id) => id !== objectID) : [...prev, objectID]
    );
  };

  const value = useMemo(() => ({ favorites, toggleFavorite }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
