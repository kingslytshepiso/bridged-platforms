import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      title: "Vision",
      description:
        "To build an interconnected ecosystem of intelligent systems that leverage AI, automation, and secure APIs to streamline workflows, reduce manual effort, and maximize the value of existing enterprise tools like Microsoft Power Platform.",
    },
    {
      title: "Mission",
      description:
        "To empower businesses to develop and deploy high-quality software faster by integrating AI-driven automation, custom applications, and secure, cost-optimized infrastructure, while ensuring human oversight and adherence to cybersecurity best practices.",
    },
    {
      title: "Strategic Outlook",
      description:
        "Support businesses in delivering software faster while maintaining high standards of quality and security. Recognize the ongoing need for skilled AI operators to manage sensitive knowledge responsibly. Prioritize quality, reproducibility, and compliance in all solutions.",
    },
  ];

  return (
    <section
      id="about"
      className="section-padding bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Bridged Platforms
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Driving innovation through intelligent automation and secure
            integration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-primary-700 dark:text-primary-400 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Developer Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Developer Tools & Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Cloud Error Detection
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Tools to accelerate cloud error detection in AWS, Azure, and
                  third-party environments
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-lg bg-secondary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Quality Standards
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Use of linters, unit tests, and standards enforcement across
                  development frameworks
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  AI-Assisted Development
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  AI-assisted resolution of simple merge conflicts to save
                  developer time
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Security First
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Application of the principle of least privilege to design
                  user-based pricing models
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
