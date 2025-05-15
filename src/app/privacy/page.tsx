import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          
          <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
            <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              At Y62 Downloader, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We collect the following information:
            </p>
            <ul>
              <li>Account information: email address and password</li>
              <li>Usage data: videos downloaded, download history, and quality preferences</li>
              <li>Payment information: when you subscribe to premium services</li>
              <li>Device information: IP address, browser type, and operating system</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process your transactions</li>
              <li>Send you service updates and administrative messages</li>
              <li>Improve and personalize your experience</li>
              <li>Monitor service usage and identify trends</li>
            </ul>
            
            <h2>4. Data Storage and Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              Downloaded videos are temporarily stored on our servers and automatically deleted after 24 hours.
            </p>
            
            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, 
              and understand where our visitors are coming from.
            </p>
            
            <h2>6. Third-Party Services</h2>
            <p>
              We may use third-party services for payment processing and analytics. These services have their own 
              privacy policies and we recommend reviewing them.
            </p>
            
            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to:
            </p>
            <ul>
              <li>Access and receive a copy of your data</li>
              <li>Rectify or update your information</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict or object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@y62downloader.com.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              By using our service, you consent to our Privacy Policy.
              See also our <Link href="/terms" className="text-red-600 hover:text-red-500">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
