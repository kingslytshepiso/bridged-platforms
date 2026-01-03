import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import {
  HiBolt,
  HiCurrencyDollar,
  HiLink,
  HiLockClosed,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import { MdMemory } from "react-icons/md";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      title: "Power Platform Consulting",
      description:
        "Expert consulting on system automation using Microsoft Power Platform and custom deployment workflows to streamline your business processes.",
      icon: HiBolt,
      color: "primary",
    },
    {
      title: "Custom AI Applications",
      description:
        "Development of custom applications with integrated AI models for specific tasks, tailored to your unique business requirements.",
      icon: MdMemory,
      color: "secondary",
    },
    {
      title: "API Integration",
      description:
        "API-based system integration to enable agentic workflows across platforms, connecting your existing tools seamlessly.",
      icon: HiLink,
      color: "accent",
    },
    {
      title: "Cost Optimization",
      description:
        "Establishment of specialized teams to optimize costs across cloud and software services, maximizing your ROI.",
      icon: HiCurrencyDollar,
      color: "primary",
    },
    {
      title: "Cybersecurity Implementation",
      description:
        "Implementation of strong cybersecurity standards as a foundational layer, ensuring your systems are protected.",
      icon: HiLockClosed,
      color: "secondary",
    },
    {
      title: "Developer Tools & Practices",
      description:
        "Tools and practices to accelerate cloud error detection, enforce standards, and streamline development workflows.",
      icon: HiWrenchScrewdriver,
      color: "accent",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const getColorClasses = (color) => {
    const colors = {
      primary:
        "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-900/50",
      secondary:
        "bg-secondary-50 dark:bg-secondary-900/30 border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-900/50",
      accent:
        "bg-accent-50 dark:bg-accent-900/30 border-accent-200 dark:border-accent-700 hover:bg-accent-100 dark:hover:bg-accent-900/50",
    };
    return colors[color] || colors.primary;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      primary: "bg-primary-600",
      secondary: "bg-secondary-600",
      accent: "bg-accent-600",
    };
    return colors[color] || colors.primary;
  };

  return (
    <section
      id="services"
      className="section-padding bg-white dark:bg-gray-800"
    >
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Core Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive solutions to accelerate your digital transformation
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${getColorClasses(
                service.color
              )}`}
            >
              <div
                className={`w-16 h-16 rounded-lg ${getIconColorClasses(
                  service.color
                )} flex items-center justify-center mb-4`}
              >
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
