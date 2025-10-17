import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useOverLay } from "../../Contexts/OverLayContext";
const PageNotFound = () => {
  const { hideLoading } = useOverLay();
  // Set the HTTP status code to 404 for SEO and analytics
  useEffect(() => {
    // This is a client-side approach - for proper 404 status, configure your server
    document.title = "Page Not Found | 404 Error";
    hideLoading();
  }, []);

  return (
    <div className=" -to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 w-full page-not-found">
      <div className="max-w-md w-full space-y-8 text-center fadeIn">
        {/* 404 Graphic */}
        <div className="relative">
          <div className="text-9xl font-bold text-gray-300">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-[#f59e0b]">
              Page Not Found
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Oops! Lost in Space?
          </h2>
          <p className="text-lg text-gray-600">
            The page you're looking for seems to have drifted off into the
            cosmos. Don't worry, we'll help you get back home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#f59e0b] hover:bg-[#f7c878] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f59e0b] transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f59e0b] transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="pt-8">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please{" "}
            <a
              href="/contact"
              className="text-[#f59e0b] hover:text-[#f7c878] font-medium"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
