"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaCrown } from "react-icons/fa";
import { useAuth } from "../../components/AuthProvider";

export default function PremiumPage() {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/premium");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = token;
      }
      
      const response = await fetch("http://localhost:5000/api/upgrade", {
        method: "POST",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upgrade failed");
      }

      await refreshUser();
      setMessage("Successfully upgraded to premium!");
      
      // Simulate payment processing
      setTimeout(() => {
        router.push("/download");
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Upgrade to <span className="text-red-600">Premium</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited downloads, 4K quality, and more premium features
          </p>
        </div>

        {user?.isPremium ? (
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-lg">
            <FaCrown className="mx-auto h-16 w-16 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">You're a Premium Member!</h2>
            <p className="text-yellow-100 mb-4">Enjoy all premium features with your subscription.</p>
            <button
              onClick={() => router.push("/download")}
              className="bg-white text-yellow-600 hover:bg-yellow-50 transition-colors px-6 py-2 rounded-lg font-bold"
            >
              Start Downloading
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            {message && (
              <div className="mb-8 max-w-md mx-auto bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaCheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-8 max-w-md mx-auto bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium plan */}
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white text-center">
                <h2 className="text-2xl font-bold">Premium Plan</h2>
                <div className="mt-4 flex justify-center items-baseline">
                  <span className="text-5xl font-extrabold">$9.99</span>
                  <span className="ml-2 text-xl text-red-200">/month</span>
                </div>
              </div>
              
              <div className="p-8">
                <ul className="space-y-4">
                  {[
                    "Unlimited video downloads",
                    "Up to 4K (2160p) quality",
                    "No watermarks",
                    "Audio extraction (MP3)",
                    "Priority support",
                    "No ads",
                    "Download history & favorites",
                  ].map((feature, i) => (
                    <li key={i} className="flex">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCrown className="mr-2" />
                        Upgrade to Premium
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center dark:text-gray-400">
                    Cancel anytime. No hidden fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                Free vs Premium Comparison
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-400">Feature</th>
                      <th className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Free Plan</th>
                      <th className="py-4 px-6 text-center text-red-600 dark:text-red-500">Premium Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 text-gray-800 dark:text-gray-200">Downloads</td>
                      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">10 videos</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900 dark:text-white">Unlimited</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 text-gray-800 dark:text-gray-200">Max Quality</td>
                      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">1080p</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900 dark:text-white">4K (2160p)</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 text-gray-800 dark:text-gray-200">Audio Extraction</td>
                      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Limited</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900 dark:text-white">Full Access</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 text-gray-800 dark:text-gray-200">Watermark</td>
                      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Yes</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900 dark:text-white">No</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-800 dark:text-gray-200">Support</td>
                      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Basic</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900 dark:text-white">Priority</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
