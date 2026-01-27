import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { HiBolt, HiGlobeAlt } from "react-icons/hi2";
import { MdEmail } from "react-icons/md";
import { trackContactForm, trackPageView, trackException } from "../services/applicationInsights";
import { logError, logWarning } from "../utils/logger";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    type: null, // 'success', 'error', 'loading'
    message: "",
  });
  const [formStarted, setFormStarted] = useState(false);

  // Track when Contact section comes into view
  useEffect(() => {
    if (isInView) {
      trackPageView('Contact Section');
    }
  }, [isInView]);

  // API endpoint - defaults to localhost for development
  // Set VITE_API_URL environment variable for production
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:7071/api/ContactForm";

  // Azure Function Key for authentication
  // Set VITE_FUNCTION_KEY environment variable
  // For local dev, Azure Functions Core Tools provides a default key
  // For production, get the key from Azure Portal > Function > Function Keys
  const FUNCTION_KEY = import.meta.env.VITE_FUNCTION_KEY || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending message..." });
    trackContactForm('submitted', { hasName: !!formData.name, hasEmail: !!formData.email });

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Build URL with code parameter for authentication
      let requestUrl = API_URL;
      if (FUNCTION_KEY) {
        // Append code as query parameter
        // Decode the function key first to avoid double-encoding
        // (searchParams.set() will encode it properly)
        // Try to decode, but if it fails (not encoded), use original
        let decodedKey = FUNCTION_KEY;
        try {
          // Check if it looks URL-encoded (contains %)
          if (FUNCTION_KEY.includes("%")) {
            decodedKey = decodeURIComponent(FUNCTION_KEY);
          }
        } catch (decodeError) {
          // If decoding fails, use original key
          logWarning("Failed to decode function key, using original", { error: decodeError });
          decodedKey = FUNCTION_KEY;
        }
        try {
          const url = new URL(requestUrl);
          url.searchParams.set("code", decodedKey);
          requestUrl = url.toString();
        } catch (urlError) {
          logError("Failed to build request URL", urlError, { apiUrl: API_URL });
          throw new Error("Invalid API URL configuration");
        }
      }

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        logError("Failed to parse response as JSON", jsonError, {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error("Invalid response from server");
      }

      if (response.ok) {
        setStatus({
          type: "success",
          message:
            "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        });
        trackContactForm('success');
        setFormData({ name: "", email: "", message: "" });
        setFormStarted(false);
        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus({ type: null, message: "" });
        }, 5000);
      } else {
        const errorMessage = result.error || "Failed to send message. Please try again.";
        logError("Contact form submission failed", new Error(errorMessage), {
          status: response.status,
          statusText: response.statusText,
          responseData: result,
        });
        trackContactForm('error', { error: errorMessage });
        trackException(new Error(errorMessage), {
          component: 'Contact',
          action: 'submit',
          statusCode: response.status,
        });
        setStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      logError("Contact form network error", error, {
        apiUrl: API_URL,
        formData: { name: formData.name, email: formData.email, hasMessage: !!formData.message },
      });
      trackContactForm('error', { error: error.message });
      trackException(error, {
        component: 'Contact',
        action: 'submit',
        errorType: error.name || 'NetworkError',
      });
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const handleChange = (e) => {
    if (!formStarted) {
      setFormStarted(true);
      trackContactForm('started');
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="section-padding bg-white dark:bg-gray-800">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to transform your business with intelligent automation?
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={status.type === "loading"}
                whileHover={status.type !== "loading" ? { scale: 1.05 } : {}}
                whileTap={status.type !== "loading" ? { scale: 0.95 } : {}}
                className={`w-full md:w-auto px-8 py-4 rounded-lg font-semibold shadow-lg transition-colors ${
                  status.type === "loading"
                    ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {status.type === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : status.type === "success" ? (
                  "Message Sent! ✓"
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>

            {/* Status Messages */}
            {status.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-4 rounded-lg border ${
                  status.type === "success"
                    ? "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300"
                    : status.type === "error"
                    ? "bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300"
                    : "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  {status.type === "success" && (
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {status.type === "error" && (
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <p className="flex-1">{status.message}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-3">
                <MdEmail className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                admin@bridgedplatforms.co.za
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-3">
                <HiGlobeAlt className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Region
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                African Market
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-3">
                <HiBolt className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Response Time
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Within 24 hours
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
