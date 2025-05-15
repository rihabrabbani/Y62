import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          
          <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
            <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Y62 Downloader! These Terms of Service govern your use of our website and services. By using our 
              service, you agree to these terms. Please read them carefully.
            </p>
            
            <h2>2. Service Description</h2>
            <p>
              Y62 Downloader provides a service that allows users to download videos from YouTube for personal, 
              non-commercial use. Our service is available in both free and premium tiers.
            </p>
            
            <h2>3. Account Registration</h2>
            <p>
              To use our services, you must register an account with valid information. You are responsible for maintaining 
              the confidentiality of your account and password.
            </p>
            
            <h2>4. Free vs Premium Service</h2>
            <p>
              The free tier allows users to download up to 10 videos. Premium membership provides unlimited downloads, 
              higher quality options, and additional features for a monthly subscription fee.
            </p>
            
            <h2>5. Payment Terms</h2>
            <p>
              Premium subscriptions are billed monthly, and you may cancel at any time. No refunds will be issued for 
              partial month subscriptions.
            </p>
            
            <h2>6. Acceptable Use</h2>
            <p>
              You agree not to use our service for any illegal purposes or in any way that violates copyright laws or 
              YouTube's Terms of Service. Y62 Downloader is intended for personal use only.
            </p>
            
            <h2>7. Copyright and Intellectual Property</h2>
            <p>
              Y62 Downloader respects intellectual property rights. We do not claim ownership of the content you download, 
              and you are solely responsible for ensuring your use of downloaded content complies with applicable laws.
            </p>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              Our service is provided "as is" without warranties of any kind. We are not responsible for any harm that may 
              result from your use of our service.
            </p>
            
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our service constitutes acceptance 
              of the modified terms.
            </p>
            
            <h2>10. Contact Information</h2>
            <p>
              For questions regarding these terms, please contact us at support@y62downloader.com.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              By using our service, you acknowledge that you have read and understand these Terms.
              See also our <Link href="/privacy" className="text-red-600 hover:text-red-500">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
