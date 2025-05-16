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
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  // Helper function to normalize URL (adds https if missing)
  const handleUrlChange = (input: string) => {
    let newUrl = input.trim();
    
    // Check if the pasted content is a YouTube video ID
    if (newUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(newUrl)) {
      newUrl = `https://www.youtube.com/watch?v=${newUrl}`;
    }
    
    // Add https:// if the URL starts with youtube or youtu.be
    if (newUrl.match(/^(youtube\.com|youtu\.be)/i)) {
      newUrl = `https://${newUrl}`;
    }
    
    setUrl(newUrl);
  };

  return (
    <form onSubmit={handleSubmit} className={`${homepageVersion ? "" : "mb-8"} relative`}>
      <div className="flex flex-col space-y-3">
        <div 
          className={`flex items-center border-2 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
            isFocused 
              ? "border-red-400 ring-4 ring-red-300/20 dark:ring-red-500/20 shadow-lg" 
              : "border-gray-300"
          }`}
        >
          <div className="p-3 text-red-500">
            <FaYoutube size={24} className={`transition-all duration-300 ${isFocused ? "text-red-500 scale-110" : "text-red-400"}`} />
          </div>
          <input
            type="text"
            placeholder="Paste YouTube video URL here..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 p-3 outline-none bg-transparent text-gray-800 dark:text-white font-medium placeholder-gray-400 transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`
            bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800
            text-white font-medium py-3 px-6 rounded-xl 
            flex justify-center items-center space-x-2 
            disabled:opacity-70 disabled:cursor-not-allowed 
            transition-all duration-300 
            shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30
            hover:-translate-y-0.5 active:translate-y-0
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
