"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { FaCrown, FaDownload, FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login?redirect=/profile');
    }
    
    // Refresh user data when profile page loads
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated, router, refreshUser]);

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Profile header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-red-500 to-red-700"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full bg-white dark:bg-gray-700 p-2">
                <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <FaUser className="h-12 w-12 text-gray-400 dark:text-gray-300" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile content */}
          <div className="mt-20 px-8 pb-8">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.email}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Account Status: {user.isPremium ? (
                    <span className="text-yellow-600 font-medium">Premium</span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Free</span>
                  )}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
            
            {/* Usage stats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Download Usage
                  </h2>
                  <FaDownload className="text-gray-500 dark:text-gray-400" />
                </div>
                
                {user.isPremium ? (
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                      Unlimited
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Premium membership
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>Used {user.downloadCount} of 10</span>
                      <span>{10 - user.downloadCount} remaining</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-red-600 h-2.5 rounded-full" 
                        style={{ width: `${(user.downloadCount / 10) * 100}%` }}
                      />
                    </div>
                    <div className="mt-4">
                      <Link 
                        href="/premium" 
                        className="text-sm text-red-600 hover:text-red-500"
                      >
                        Upgrade for unlimited downloads →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {user.isPremium ? (
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">
                      Premium Benefits
                    </h2>
                    <FaCrown />
                  </div>
                  
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Unlimited downloads
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      4K quality videos
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      No watermarks
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Priority support
                    </li>
                  </ul>
                  
                  <div className="mt-4 text-center">
                    <Link 
                      href="/download" 
                      className="inline-block bg-white text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Start Downloading
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Upgrade to Premium
                    </h2>
                    <FaCrown className="text-gray-500 dark:text-gray-400" />
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get unlimited downloads, 4K quality videos, and more premium features.
                  </p>
                  
                  <Link
                    href="/premium"
                    className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}
            </div>
            
            {/* Recent downloads placeholder */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Recent Downloads
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Your recent downloads will appear here
                </p>
                
                <Link 
                  href="/download" 
                  className="inline-block mt-4 text-red-600 hover:text-red-500"
                >
                  Download a video →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
