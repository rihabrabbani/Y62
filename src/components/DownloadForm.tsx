"use client";

import { useState } from "react";
import { FaYoutube, FaSearch, FaSpinner } from "react-icons/fa";

interface DownloadFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  homepageVersion?: boolean;
}

export default function DownloadForm({ onSubmit, isLoading = false, homepageVersion = false }: DownloadFormProps) {
  const [url, setUrl] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${homepageVersion ? "" : "mb-8"} relative`}>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center border-2 border-gray-600 dark:border-gray-600 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-300/20 bg-gray-800 dark:bg-gray-800 shadow-sm transition-all duration-300">
          <div className="p-3 text-white">
            <FaYoutube size={24} className="text-red-500" />
          </div>
          <input
            type="text"
            placeholder="Paste YouTube video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 outline-none bg-transparent text-white dark:text-white font-medium placeholder-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`
            bg-blue-600 hover:bg-blue-700
            text-white font-medium py-3 px-6 rounded-xl 
            flex justify-center items-center space-x-2 
            disabled:opacity-70 disabled:cursor-not-allowed 
            transition-all duration-300 
            hover:shadow-lg hover:shadow-blue-500/20 
            hover:-translate-y-0.5
          `}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2 h-5 w-5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FaSearch className="mr-2" />
              <span>Check Video</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
