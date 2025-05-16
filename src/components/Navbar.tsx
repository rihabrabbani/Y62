"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaDownload, FaUser, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-white/95 shadow-lg backdrop-blur-lg dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/20 transform group-hover:scale-105 transition-all">
                <FaDownload className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold font-heading">
                <span className="text-red-600 group-hover:text-red-500 transition-colors">Y62</span>
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Downloader</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === "/"
                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              }`}
            >
              Home
            </Link>
            <Link
              href="/download"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === "/download"
                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              }`}
            >
              Download
            </Link>
            <Link
              href="/premium"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === "/premium"
                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              }`}
            >
              Premium
            </Link>

            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
                    <span className="mr-1">Account</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="py-1 rounded-xl overflow-hidden">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-red-500" />
                          Profile
                        </div>
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <FaSignOutAlt className="mr-2 text-red-500" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                {user?.isPremium && (
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-4 py-1 rounded-full text-xs font-bold shadow-md shadow-amber-500/20 animate-pulse">
                    PREMIUM
                  </span>
                )}
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium border border-red-500 text-red-500 hover:bg-red-50 transition-all hover:shadow-md"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-md hover:shadow-lg hover:shadow-red-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="h-5 w-5 text-amber-400" />
              ) : (
                <FaMoon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Dark mode toggle - mobile */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="h-5 w-5 text-amber-400" />
              ) : (
                <FaMoon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-5 w-5" />
              ) : (
                <FaBars className="block h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - fixed the visibility logic and styling */}
      <div 
        className={`md:hidden fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isOpen 
            ? "opacity-100 top-16 visible" 
            : "opacity-0 top-12 invisible"
        }`}
      >
        <div className="px-2 pt-2 pb-4 mx-2 my-2 space-y-1 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className={`block px-4 py-3 rounded-xl text-base font-medium ${
              pathname === "/"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/download"
            className={`block px-4 py-3 rounded-xl text-base font-medium ${
              pathname === "/download"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            }`}
          >
            Download
          </Link>
          <Link
            href="/premium"
            className={`block px-4 py-3 rounded-xl text-base font-medium ${
              pathname === "/premium"
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            }`}
          >
            Premium
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className={`block px-4 py-3 rounded-xl text-base font-medium ${
                  pathname === "/profile"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                }`}
              >
                <div className="flex items-center">
                  <FaUser className="mr-2 text-red-500" />
                  Profile {user?.isPremium && <span className="ml-2 text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full">PREMIUM</span>}
                </div>
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <div className="flex items-center">
                  <FaSignOutAlt className="mr-2 text-red-500" />
                  Sign out
                </div>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2 px-2">
              <Link
                href="/login"
                className="block w-full px-5 py-3 rounded-xl text-center text-base font-medium border border-red-500 text-red-500 hover:bg-red-50 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full px-5 py-3 rounded-xl text-center text-base font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
