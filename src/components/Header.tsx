import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  function close() {
    setOpen(false);
  }

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium hover:scale-105 transition-all";
  const linkMuted = "text-white/80 hover:text-white";
  const linkActive = "bg-white/10 text-white";

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="relative overflow-visible">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight hover:scale-105 transition-all"
          onClick={close}
        >
          Optima
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <Link
            to="/"
            className={`${linkBase} ${isActive("/") ? linkActive : linkMuted}`}
          >
            Home
          </Link>
          <Link
            to="/resources"
            className={`${linkBase} ${
              isActive("/resources") ? linkActive : linkMuted
            }`}
          >
            Resources
          </Link>
          <Link
            to="/graph"
            className={`${linkBase} ${
              isActive("/graph") ? linkActive : linkMuted
            }`}
          >
            Graph
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 border border-white/10"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          {open ? (
            // X icon
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            // Burger icon
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`sm:hidden transition-all overflow-hidden ${
          open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col rounded-md border border-white/10 bg-white/5 p-2">
          <Link
            onClick={close}
            to="/"
            className={`${linkBase} ${isActive("/") ? linkActive : linkMuted}`}
          >
            Home
          </Link>
          <Link
            onClick={close}
            to="/resources"
            className={`${linkBase} ${
              isActive("/resources") ? linkActive : linkMuted
            }`}
          >
            Resources
          </Link>
          <Link
            onClick={close}
            to="/graph"
            className={`${linkBase} ${
              isActive("/graph") ? linkActive : linkMuted
            }`}
          >
            Graph
          </Link>
        </div>
      </div>
    </header>
  );
}
