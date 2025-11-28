// Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const linkStyle = "pb-1 transition-all text-lg font-extrabold px-2";

  return (
    <nav className="bg-blue-200 rounded-full mt-6 mx-2 shadow-lg lg:px-4 py-3 ">
      {/* Top Row: Logo & Hamburger */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/GraphuraLogo.jpg"
            alt="Graphura Logo"
            className="h-16 mr-6"
          />
        </div>

        {/* Hamburger Icon (Mobile only) */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setNavOpen(!navOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10 font-semibold text-black relative">
          <Link
            to="/jobs"
            className={`${linkStyle} border-b-2 ${
              location.pathname === "/jobs"
                ? "border-black text-blue-700"
                : "border-transparent text-black"
            } hover:text-blue-700 hover:border-blue-700`}
          >
            Jobs
          </Link>
          <Link
            to="/courses"
            className={`${linkStyle} border-b-2 ${
              location.pathname === "/courses"
                ? "border-black text-blue-700"
                : "border-transparent text-black"
            } hover:text-blue-700 hover:border-blue-700`}
          >
            Cources
          </Link>
          <Link
            to="/internships"
            className={`${linkStyle} border-b-2 ${
              location.pathname === "/internships"
                ? "border-black text-blue-700"
                : "border-transparent text-black"
            } hover:text-blue-700 hover:border-blue-700`}
          >
            Internships
          </Link>

          {/* Log In Dropdown Button - Desktop */}
          <div className="relative">
            <button
              type="button"
              className="bg-blue-100 border border-blue-400 rounded-full px-4 py-1 text-black font-extrabold hover:bg-blue-300 transition text-lg ml-4"
              onClick={() => setShowLoginOptions(!showLoginOptions)}
            >
              Log in
            </button>
            {showLoginOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10 divide-y divide-gray-200">
                <Link
                  to="/intern-login"
                  className="block px-4 py-2 hover:bg-blue-100 text-blue-900 font-semibold"
                  onClick={() => setShowLoginOptions(false)}
                >
                  Intern Login
                </Link>
                <Link
                  to="/mentor-login"
                  className="block px-4 py-2 hover:bg-blue-100 text-blue-900 font-semibold"
                  onClick={() => setShowLoginOptions(false)}
                >
                  Mentor Login
                </Link>
                <Link
                  to="/admin-login"
                  className="block px-4 py-2 hover:bg-blue-100 text-blue-900 font-semibold"
                  onClick={() => setShowLoginOptions(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/hiring-team-login"
                  className="block px-4 py-2 hover:bg-blue-100 text-blue-900 font-semibold"
                  onClick={() => setShowLoginOptions(false)}
                >
                  Hiring Team
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="flex flex-col items-center justify-center md:hidden mt-3 space-y-2 text-center w-full">
          <Link
            to="/jobs"
            className={`${linkStyle} border-b-2 ${
              location.pathname === "/jobs"
                ? "border-black text-blue-700"
                : "border-transparent text-black"
            } hover:text-blue-700 hover:border-blue-700`}
            onClick={() => setNavOpen(false)}
          >
            Jobs
          </Link>
          <Link
            to="/courses"
            className={`${linkStyle} border-b-2 ${
              location.pathname === "/courses"
                ? "border-black text-blue-700"
                : "border-transparent text-black"
            } hover:text-blue-700 hover:border-blue-700`}
            onClick={() => setNavOpen(false)}
          >
            Cources
          </Link>
          <Link
            to="/internships"
            className={`${linkStyle} border-b-2 ${
              location.pathname === "/internships"
                ? "border-black text-blue-700"
                : "border-transparent text-black"
            } hover:text-blue-700 hover:border-blue-700`}
            onClick={() => setNavOpen(false)}
          >
            Internships
          </Link>

          {/* Log In Dropdown - Mobile */}
          <div className="relative flex flex-col items-center w-full">
            <button
              type="button"
              className="bg-blue-100 border border-blue-400 rounded-full px-4 py-1 text-black font-extrabold hover:bg-blue-300 transition text-lg mt-2 mx-auto"
              onClick={() => setShowLoginOptions(!showLoginOptions)}
            >
              Log in
            </button>
            {showLoginOptions && (
              <div className="mt-2 w-48 bg-transparent shadow-none mx-auto">
                <Link
                  to="/intern-login"
                  className="block px-4 py-2 text-blue-900 font-semibold hover:text-blue-600"
                  onClick={() => {
                    setShowLoginOptions(false);
                    setNavOpen(false);
                  }}
                >
                  Intern Login
                </Link>
                <Link
                  to="/mentor-login"
                  className="block px-4 py-2 text-blue-900 font-semibold hover:text-blue-600"
                  onClick={() => {
                    setShowLoginOptions(false);
                    setNavOpen(false);
                  }}
                >
                  Mentor Login
                </Link>
                <Link
                  to="/admin-login"
                  className="block px-4 py-2 text-blue-900 font-semibold hover:text-blue-600"
                  onClick={() => {
                    setShowLoginOptions(false);
                    setNavOpen(false);
                  }}
                >
                  Admin Login
                </Link>
                <Link
                  to="/hiring-team-login"
                  className="block px-4 py-2 text-blue-900 font-semibold hover:text-blue-600"
                  onClick={() => {
                    setShowLoginOptions(false);
                    setNavOpen(false);
                  }}
                >
                  Hiring Team
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
