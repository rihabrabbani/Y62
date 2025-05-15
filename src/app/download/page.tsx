"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DownloadForm from "../../components/DownloadForm";
import { useAuth } from "../../components/AuthProvider";
import VideoPreview from "../../components/VideoPreview";

interface VideoInfo {
  url: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  formats?: any[];
  // Add other properties that videoInfo might have
}

export default function DownloadPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // Check download limits
  const hasReachedLimit = user && !user.isPremium && user.downloadCount >= 10;

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login?redirect=/download');
    }
  }, [isAuthenticated, router]);

  const resetState = () => {
    setVideoInfo(null);
    setError("");
    setDownloadStatus("");
    setDownloadUrl("");
  };

  const handleFormSubmit = async (url: any) => {
    resetState();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/video-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video info');
      }
      
      setVideoInfo(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (quality: any) => {
    if (!videoInfo) return;
    if (hasReachedLimit) {
      setError("You've reached your download limit. Please upgrade to premium.");
      return;
    }

    setDownloadStatus("preparing");
    
    try {
      const response = await fetch('http://localhost:5000/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ 
          url: videoInfo.url,
          quality 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Download failed');
      }
      
      setDownloadStatus("complete");
      setDownloadUrl(`http://localhost:5000${data.downloadUrl}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Download failed');
      setDownloadStatus("failed");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            Download YouTube Videos
          </h1>
          
          {/* Download Limits Warning */}
          {!user?.isPremium && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Free account: {user?.downloadCount || 0}/10 downloads used.
                    {hasReachedLimit ? (
                      <span className="font-bold"> You've reached your limit. <a href="/premium" className="underline">Upgrade now</a>.</span>
                    ) : (
                      <span> Upgrade to <a href="/premium" className="underline">premium</a> for unlimited downloads.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <DownloadForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {videoInfo && (
            <VideoPreview 
              videoInfo={videoInfo} 
              onDownload={handleDownload}
              downloadStatus={downloadStatus}
              downloadUrl={downloadUrl}
              isPremium={user?.isPremium}
            />
          )}
          
          <div className="mt-12 border-t dark:border-gray-700 pt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">How to Download</h2>
            <ol className="list-decimal pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Copy the YouTube video URL from your browser</li>
              <li>Paste the URL in the input field above</li>
              <li>Click "Check Video" to see the video details</li>
              <li>Select your preferred quality and format</li>
              <li>Click "Download" to start the download process</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
