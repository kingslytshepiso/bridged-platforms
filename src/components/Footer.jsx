import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeItem, setActiveItem] = useState(null);

  const handleFocusAreaInteraction = (index) => {
    // Toggle on click/touch for mobile, or set on hover for desktop
    setActiveItem(activeItem === index ? null : index);
  };

  const handleFocusAreaHover = (index) => {
    // Only set on hover for desktop devices
    if (window.matchMedia("(hover: hover)").matches) {
      setActiveItem(index);
    }
  };

  const handleFocusAreaLeave = () => {
    // Only clear on mouse leave for desktop devices
    if (window.matchMedia("(hover: hover)").matches) {
      setActiveItem(null);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo className="h-10 w-auto" forceLight={true} />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering businesses with AI-driven automation, secure
              integrations, and intelligent systems.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Focus Areas
            </h4>
            <ul className="space-y-2 text-gray-400 relative">
              {["AI & Automation", "Workflow Implementation", "API Integration", "Cybersecurity"].map((item, index) => (
                <li
                  key={item}
                  className="relative group cursor-pointer touch-manipulation"
                  onMouseEnter={() => handleFocusAreaHover(index)}
                  onMouseLeave={handleFocusAreaLeave}
                  onClick={() => handleFocusAreaInteraction(index)}
                  onTouchStart={() => handleFocusAreaInteraction(index)}
                >
                  <span className={`relative z-10 inline-block transition-colors ${
                    activeItem === index ? "text-white" : "group-hover:text-white"
                  }`}>
                    {item}
                  </span>
                  
                  {/* Animated element on the right */}
                  <AnimatePresence>
                    {activeItem === index && (
                      <motion.div
                        initial={{ opacity: 0, x: -20, scaleX: 0 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          scaleX: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          x: -20, 
                          scaleX: 0,
                          transition: { duration: 0.2 }
                        }}
                        className="absolute right-0 top-0 bottom-0 w-32 origin-right pointer-events-none"
                        style={{
                          height: "100%",
                        }}
                      >
                        {/* Animated gradient bars */}
                        <div className="relative h-full w-full overflow-hidden">
                          <motion.div
                            animate={{
                              x: [0, 100, 0],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"
                            style={{
                              width: "200%",
                            }}
                          />
                          <motion.div
                            animate={{
                              x: [0, -100, 0],
                              opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-500/40 to-transparent"
                            style={{
                              width: "200%",
                            }}
                          />
                          <motion.div
                            animate={{
                              x: [0, 80, 0],
                              opacity: [0.1, 0.4, 0.1],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-500/40 to-transparent"
                            style={{
                              width: "200%",
                            }}
                          />
                          
                          {/* Shimmer effect */}
                          <motion.div
                            animate={{
                              x: ["-100%", "200%"],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            style={{
                              transform: "skewX(-20deg)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Bridged Platforms. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with quality, security, and innovation in mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
