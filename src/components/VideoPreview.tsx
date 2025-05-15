"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDownload, FaCheckCircle, FaCrown, FaMusic, FaVideo } from "react-icons/fa";

interface VideoPreviewProps {
  videoInfo: {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
    url?: string;
  };
  onDownload: (quality: string) => void;
  downloadStatus: string;
  downloadUrl: string;
  isPremium?: boolean;
}

export default function VideoPreview({ 
  videoInfo, 
  onDownload, 
  downloadStatus, 
  downloadUrl,
  isPremium = false 
}: VideoPreviewProps) {
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  
  // Format video duration from seconds to mm:ss
  const formatDuration = (seconds: string) => {
    const mins = Math.floor(parseInt(seconds) / 60);
    const secs = parseInt(seconds) % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleDownload = () => {
    onDownload(`${selectedQuality}-${selectedFormat}`);
  };

  return (
    <div className="mt-8 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Thumbnail */}
        <div className="relative w-full md:w-2/5 aspect-video rounded-xl overflow-hidden shadow-md">
          <Image 
            src={videoInfo.thumbnail} 
            alt={videoInfo.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {formatDuration(videoInfo.duration)}
          </div>
        </div>

        {/* Video Info & Download Options */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2 font-heading">
            {videoInfo.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            By {videoInfo.author}
          </p>

          <div className="space-y-6">
            {/* Download options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Quality
                </label>
                <div className="flex flex-wrap gap-2">
                  {["360p", "480p", "720p", "1080p", ...(isPremium ? ["1440p", "2160p"] : [])].map(
                    (quality) => (
                    <button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                            selectedQuality === quality
                                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md font-bold scale-105 ring-2 ring-primary/50"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        } ${
                            !isPremium && (quality === "1440p" || quality === "2160p")
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        disabled={!isPremium && (quality === "1440p" || quality === "2160p")}
                    >
                        {quality}
                        {!isPremium && (quality === "1440p" || quality === "2160p") && 
                            <FaCrown className="ml-1.5 inline-block text-accent" />
                        }
                    </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Format
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFormat("mp4")}
                    className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                      selectedFormat === "mp4"
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md font-bold scale-105 ring-2 ring-primary/50"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaVideo />
                    MP4 Video
                  </button>
                  <button
                    onClick={() => setSelectedFormat("mp3")}
                    className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                      selectedFormat === "mp3"
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md font-bold scale-105 ring-2 ring-primary/50"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaMusic />
                    MP3 Audio
                  </button>
                </div>
              </div>
            </div>

            {/* Download button or status */}
            <div className="mt-6">
              {downloadStatus === "complete" ? (
                <div className="space-y-3">
                  <div className="flex items-center text-success">
                    <FaCheckCircle className="mr-2" />
                    <span>Download ready!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download
                    className="w-full bg-blue-600 hover:bg-blue-700
                  text-white font-medium py-3 px-6 rounded-xl 
                  flex justify-center items-center space-x-2
                  disabled:opacity-70 disabled:cursor-not-allowed 
                  transition-all duration-300 
                  hover:shadow-lg hover:shadow-blue-500/20 
                  hover:-translate-y-0.5"
                  >
                    <FaDownload />
                    Download Now
                  </a>
                </div>
              ) : downloadStatus === "preparing" ? (
                <button
                  disabled
                  className="w-full bg-blue-600 hover:bg-blue-700
                  text-white font-medium py-3 px-6 rounded-xl 
                  flex justify-center items-center space-x-2
                  disabled:opacity-70 disabled:cursor-not-allowed 
                  transition-all duration-300 
                  hover:shadow-lg hover:shadow-blue-500/20 
                  hover:-translate-y-0.5"
                >
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparing Download...
                </button>
              ) : downloadStatus === "failed" ? (
                <div className="text-error bg-error/10 p-4 rounded-xl">
                  Download failed. Please try again.
                </div>
              ) : (
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700
                  text-white font-medium py-3 px-6 rounded-xl 
                  flex justify-center items-center space-x-2
                  disabled:opacity-70 disabled:cursor-not-allowed 
                  transition-all duration-300 
                  hover:shadow-lg hover:shadow-blue-500/20 
                  hover:-translate-y-0.5"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              )}
              {!isPremium && (selectedQuality === "1440p" || selectedQuality === "2160p") && (
                <div className="flex items-center gap-2 mt-3 justify-center bg-warning/10 p-2 rounded-lg">
                  <FaCrown className="text-accent" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <Link href="/premium" className="text-primary underline hover:text-secondary">
                      Upgrade to Premium
                    </Link>
                    {" "}for 4K quality downloads
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
