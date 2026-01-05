import React from "react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
            <ul className="space-y-2 text-gray-400">
              <li>AI & Automation</li>
              <li>Workflow Implementation</li>
              <li>API Integration</li>
              <li>Cybersecurity</li>
              <li>African Market</li>
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
