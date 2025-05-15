"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaDownload, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-white/95 shadow-md backdrop-blur-md dark:bg-gray-900/95"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <FaDownload className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold font-heading">
                <span className="text-primary">Y62</span>
                <span className="text-secondary">Downloader</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                pathname === "/"
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/download"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                pathname === "/download"
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              }`}
            >
              Download
            </Link>
            <Link
              href="/premium"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                pathname === "/premium"
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              }`}
            >
              Premium
            </Link>

            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all">
                    <span className="mr-1">Account</span>
                    <svg
                      className="w-4 h-4"
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
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    <div className="py-1 rounded-xl overflow-hidden">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <FaUser className="mr-2" />
                          Profile
                        </div>
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <FaSignOutAlt className="mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                {user?.isPremium && (
                  <span className="bg-gradient-to-r from-accent to-warning text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    PREMIUM
                  </span>
                )}
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t dark:border-gray-700">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/"
                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-500"
                : "text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500"
            }`}
          >
            Home
          </Link>
          <Link
            href="/download"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/download"
                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-500"
                : "text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500"
            }`}
          >
            Download
          </Link>
          <Link
            href="/premium"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/premium"
                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-500"
                : "text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500"
            }`}
          >
            Premium
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/profile"
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500"
                }`}
              >
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  Profile {user?.isPremium && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PREMIUM</span>}
                </div>
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500"
              >
                <div className="flex items-center">
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </div>
              </button>
            </>
          ) : (
            <div className="space-y-1 pt-2">
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
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
