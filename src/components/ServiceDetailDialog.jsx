import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";

const ServiceDetailDialog = ({ service, isOpen, onClose }) => {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 left-4 right-4 bottom-4 md:top-[5vh] md:left-0 md:right-0 md:bottom-auto md:h-[90vh] md:max-h-[90vh] z-[70] overflow-hidden rounded-2xl shadow-2xl flex flex-col bg-black"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: 'min(56rem, calc(100vw - 2rem))',
              width: 'min(56rem, calc(100vw - 2rem))',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {/* Close Button - Always visible */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors text-white"
              aria-label="Close dialog"
            >
              <MdClose className="w-6 h-6" />
            </button>

            {/* Image Header Section */}
            {service.image ? (
              <div className="relative h-64 md:h-80 flex-shrink-0 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay - visible at top, darkening from center down */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />

                {/* Service Icon - Top Left */}
                {service.icon && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`absolute top-6 left-8 md:left-12 w-12 h-12 md:w-14 md:h-14 rounded-lg ${service.iconBgColor} flex items-center justify-center shadow-lg z-20`}
                  >
                    <service.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                )}

                {/* Title overlaying the image */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute bottom-6 left-8 md:left-12 right-4 md:right-12 text-4xl md:text-5xl font-bold leading-tight text-white z-10"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                >
                  {service.title}
                </motion.h2>
              </div>
            ) : (
              /* Fallback header when no image */
              <div className="relative h-48 md:h-56 flex-shrink-0 bg-gradient-to-br from-gray-900 to-black p-8 md:p-12">
                {/* Service Icon - Top Left */}
                {service.icon && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${service.iconBgColor} flex items-center justify-center shadow-lg mb-4`}
                  >
                    <service.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                )}

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold leading-tight text-white"
                >
                  {service.title}
                </motion.h2>
              </div>
            )}

            {/* Content Section - Black Background */}
            <div className="relative z-10 flex-1 overflow-y-auto dialog-scrollbar bg-black">
              <div className="flex flex-col p-8 md:p-12 text-white w-full box-border">
                {/* Informational Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 text-lg md:text-xl leading-relaxed w-full"
                >
                  {service.detailTexts.map((text, index) => (
                    <p key={index} className="text-gray-100 break-words">
                      {text}
                    </p>
                  ))}
                </motion.div>

                {/* Attribution */}
                {service.attribution && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 pt-6 border-t border-gray-800"
                  >
                    <p className="text-sm text-gray-400 break-words">
                      Image:{" "}
                      <a
                        href={service.attribution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-primary-400 underline transition-colors"
                      >
                        {service.attribution.photographer}
                      </a>{" "}
                      on{" "}
                      <a
                        href={service.attribution.unsplashUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-primary-400 underline transition-colors"
                      >
                        Unsplash
                      </a>
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailDialog;
