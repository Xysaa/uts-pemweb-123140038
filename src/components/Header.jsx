import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BsPaletteFill, BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { FiMenu, FiExternalLink } from "react-icons/fi";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("met:theme");
      if (saved) return saved === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  const { pathname } = useLocation();

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("met:theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("met:theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
      isActive ? "font-semibold text-sky-600 dark:text-sky-500" : ""
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="text-sky-600">
            <BsPaletteFill className="w-5 h-5" />
          </span>
          <span className="font-semibold text-lg font-serif tracking-wide">
            The Met Explorer
          </span>
        </Link>
        <nav className="hidden md:flex ml-4 gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {dark ? <BsSunFill className="w-5 h-5 text-yellow-400" /> : <BsMoonStarsFill className="w-4 h-4" />}
          </button>
          <a
            href="https://metmuseum.github.io/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Dokumentasi API The Met"
          >
            API Docs
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}