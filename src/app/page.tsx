"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaYoutube, FaDownload, FaRocket, FaCrown, FaArrowDown, FaPlayCircle } from "react-icons/fa";
import DownloadForm from "../components/DownloadForm";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-20 px-4 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-red-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-40 w-80 h-80 bg-red-700/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className={`lg:w-1/2 mb-10 lg:mb-0 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Download YouTube Videos <span className="relative inline-block">
                <span className="text-yellow-300">Faster</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300/70 transform -skew-x-12"></span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-100 max-w-lg">
              High-quality YouTube video downloads with our powerful, easy-to-use service. Try it free for your first 10 downloads!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/download" 
                className="bg-white text-red-600 hover:bg-yellow-100 transition-all py-3 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-white/20 fancy-button group"
              >
                <FaDownload className="group-hover:animate-bounce" /> Start Downloading
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="bg-transparent border-2 border-white hover:bg-white/10 transition-all py-3 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-2 group"
              >
                <FaPlayCircle className="group-hover:scale-110 transition-transform" /> How It Works
              </button>
            </div>
          </div>
          <div className={`lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -right-6 w-full h-full bg-yellow-400/70 rounded-lg rotate-6 blur-sm"></div>
              <div className="absolute -top-3 -right-3 w-full h-full bg-red-400/70 rounded-lg -rotate-3 blur-sm"></div>
              <div className="relative bg-white/95 dark:bg-gray-900/95 p-6 rounded-lg shadow-xl backdrop-blur-sm border border-white/50 dark:border-gray-800/50">
                <DownloadForm homepageVersion={true} onSubmit={() => {
                  window.location.href = '/download';
                }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaArrowDown className="text-white/70" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Why Choose Y62 <span className="red-gradient-text">Downloader</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <FaRocket className="text-4xl text-red-500" />,
                title: "Lightning Fast",
                description: "Download videos in seconds with our optimized download technology."
              },
              {
                icon: <FaDownload className="text-4xl text-red-500" />,
                title: "High Quality",
                description: "Get the best quality videos up to 4K resolution."
              },
              {
                icon: <FaCrown className="text-4xl text-red-500" />,
                title: "Premium Features",
                description: "Unlock unlimited downloads with our affordable premium plan."
              },
              {
                icon: <FaYoutube className="text-4xl text-red-500" />,
                title: "Any YouTube Video",
                description: "Compatible with all YouTube videos from any channel."
              },
              {
                icon: <i className="text-4xl text-red-500">🎧</i>,
                title: "Audio Extraction",
                description: "Extract high-quality audio from any YouTube video."
              },
              {
                icon: <i className="text-4xl text-red-500">🛠️</i>,
                title: "Easy to Use",
                description: "Simple interface makes downloading videos a breeze."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 border border-transparent ${
                  activeFeature === index ? 'border-red-400/50 shadow-lg shadow-red-500/10' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`mb-5 transition-transform duration-500 ${activeFeature === index ? 'scale-110' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                
                {/* Animated border accent */}
                <div className={`h-1 w-0 bg-gradient-to-r from-red-500 to-red-300 mt-4 rounded-full transition-all duration-500 ${
                  activeFeature === index ? 'w-1/3' : 'w-0'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white dark:from-gray-900 to-transparent"></div>
        
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Simple <span className="red-gradient-text">Pricing</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Free Plan</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try before you buy</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                  <span className="text-gray-500 dark:text-gray-400">/forever</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  10 Free Downloads
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Up to 1080p Quality
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Basic Support
                </li>
                <li className="flex items-center text-gray-400 dark:text-gray-500">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-5.293a1 1 0 001.414 1.414L10 10.414l3.293 3.293a1 1 0 001.414-1.414L11.414 9l3.293-3.293a1 1 0 00-1.414-1.414L10 7.586 6.707 4.293a1 1 0 00-1.414 1.414L8.586 9l-3.293 3.293z" clipRule="evenodd"></path>
                  </svg>
                  No 4K Downloads
                </li>
                <li className="flex items-center text-gray-400 dark:text-gray-500">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-5.293a1 1 0 001.414 1.414L10 10.414l3.293 3.293a1 1 0 001.414-1.414L11.414 9l3.293-3.293a1 1 0 00-1.414-1.414L10 7.586 6.707 4.293a1 1 0 00-1.414 1.414L8.586 9l-3.293 3.293z" clipRule="evenodd"></path>
                  </svg>
                  Watermark on Videos
                </li>
              </ul>
              
              <Link
                href="/register" 
                className="w-full block text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors py-3 px-6 rounded-xl font-bold group-hover:bg-red-100 dark:group-hover:bg-red-900/20 group-hover:text-red-600 dark:group-hover:text-red-400"
              >
                Sign Up Free
              </Link>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-8 rounded-2xl shadow-lg text-white transform scale-105 hover:scale-110 transition-all duration-300">
              <div className="text-center mb-6">
                <span className="px-4 py-1 bg-gradient-to-r from-amber-300 to-yellow-400 text-red-800 text-xs font-bold uppercase rounded-full inline-block mb-4 shadow-md">MOST POPULAR</span>
                <h3 className="text-2xl font-bold">Premium Plan</h3>
                <p className="text-red-100 mt-2">Unlimited access</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-red-200">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Unlimited Downloads
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Up to 4K Quality
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  No Watermarks
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Priority Support
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Audio Extraction
                </li>
              </ul>
              
              <Link
                href="/premium" 
                className="w-full block text-center bg-white text-red-600 hover:bg-yellow-50 transition-colors py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl"
              >
                Get Premium
              </Link>

              {/* Animated corner accent */}
              <div className="absolute -top-1 -right-1 w-16 h-16 overflow-hidden">
                <div className="shimmer absolute top-0 right-0 w-20 h-2 bg-yellow-300/50 rotate-45 translate-x-2 translate-y-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            What Our <span className="red-gradient-text">Users Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "I've tried many YouTube downloaders and Y62 is by far the best. Fast downloads and excellent quality!",
                name: "Sarah Johnson",
                title: "Content Creator",
                avatar: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                quote: "The premium plan is worth every penny. I can download as many videos as I want in 4K quality.",
                name: "Mike Thompson",
                title: "Video Editor",
                avatar: "https://randomuser.me/api/portraits/men/44.jpg"
              },
              {
                quote: "Super easy to use and the downloads are lightning fast. I recommend Y62 to all my colleagues.",
                name: "Emma Rodriguez",
                title: "Digital Marketer",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full ring-2 ring-red-500/20">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-red-800 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/10 to-transparent"></div>
          <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-red-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 top-10 w-80 h-80 bg-red-700/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to start downloading?</h2>
          <p className="text-xl mb-10 text-red-100 max-w-2xl mx-auto">
            Try Y62 Downloader today with 10 free downloads. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/download" 
              className="bg-white text-red-600 hover:bg-yellow-100 transition-all py-3 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-white/20"
            >
              Start Downloading
            </Link>
            <Link 
              href="/premium" 
              className="bg-transparent border-2 border-white hover:bg-white/10 transition-all py-3 px-8 rounded-full font-bold text-lg"
            >
              View Premium Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                  <FaDownload className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold font-heading">
                  <span className="text-red-500">Y62</span>
                  <span className="text-white">Downloader</span>
                </span>
              </div>
              <p className="text-gray-400">The best YouTube video downloader with high-quality downloads and lightning-fast speeds.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link href="/download" className="text-gray-400 hover:text-white transition-colors">Download</Link></li>
                <li><Link href="/premium" className="text-gray-400 hover:text-white transition-colors">Premium</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Y62 Downloader. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal for demo video */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowDemo(false)}>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-3xl w-full shadow-2xl transform transition-all duration-300 scale-100 opacity-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">How Y62 Downloader Works</h3>
              <button onClick={() => setShowDemo(false)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 bg-red-600/90 rounded-full flex items-center justify-center">
                  <FaPlayCircle className="text-white text-4xl" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 z-10">Demo Video Placeholder</p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                Follow these simple steps to download any YouTube video:
              </p>
              <ol className="text-left mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Copy the YouTube video URL you want to download</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Paste the URL into Y62 Downloader</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Select your preferred video quality and format</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Click download and enjoy your video!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
