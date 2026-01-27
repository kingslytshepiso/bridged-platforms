import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import {
  HiBolt,
  HiCurrencyDollar,
  HiLink,
  HiLockClosed,
  HiSparkles,
} from "react-icons/hi2";
import { MdMemory } from "react-icons/md";
import { trackServiceView, trackServiceInteraction } from "../services/applicationInsights";
import ServiceDetailDialog from "./ServiceDetailDialog";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cardRefs = useRef([]);

  // Track when Services section comes into view
  useEffect(() => {
    if (isInView) {
      trackServiceView('Services Section');
    }
  }, [isInView]);

  const services = [
    {
      title: "Custom AI Application Development",
      description:
        "Development of custom applications with integrated AI models for specific tasks, tailored to your unique business requirements and use cases.",
      icon: MdMemory,
      color: "primary",
      image: "/assets/images/ai/boliviainteligente-jk_nkEXo4aY-unsplash.jpg",
      iconBgColor: "bg-primary-600",
      attribution: {
        photographer: "BoliviaInteligente",
        url: "https://unsplash.com/@boliviainteligente?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
        unsplashUrl: "https://unsplash.com/photos/a-close-up-of-a-computer-board-with-a-logo-on-it-jk_nkEXo4aY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
      },
      detailTexts: [
        "Transform your business with intelligent applications powered by cutting-edge AI technology. Our custom AI solutions are designed to understand your unique challenges and deliver results that matter.",
        "From natural language processing to computer vision, we integrate the latest AI models into applications that learn, adapt, and evolve with your business needs. Experience the future of intelligent automation today.",
      ],
    },
    {
      title: "Agentic Workflow Implementation",
      description:
        "Design and implementation of intelligent, autonomous workflows that leverage AI agents to make decisions and execute complex business processes across platforms.",
      icon: HiSparkles,
      color: "secondary",
      image: "/assets/images/workflows/cestsibon-_ecKaEDjE6c-unsplash.jpg",
      iconBgColor: "bg-secondary-600",
      attribution: {
        photographer: "cestsibon",
        url: "https://unsplash.com/@antonearth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
        unsplashUrl: "https://unsplash.com/photos/black-flat-screen-computer-monitor-on-brown-wooden-desk-_ecKaEDjE6c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
      },
      detailTexts: [
        "Unleash the power of autonomous AI agents that think, decide, and act independently across your entire digital ecosystem. Our agentic workflows revolutionize how your business operates by creating intelligent systems that work tirelessly behind the scenes.",
        "Watch as complex multi-step processes execute flawlessly, with AI agents making real-time decisions, handling exceptions, and optimizing outcomes. It's not just automation—it's intelligent orchestration at scale.",
      ],
    },
    {
      title: "System Workflow Automations",
      description:
        "Expert automation solutions using Microsoft Power Platform and custom deployment workflows to streamline your business processes and reduce manual effort.",
      icon: HiBolt,
      color: "accent",
      image: "/assets/images/workflows/guerrillabuzz-7hA2wqBcSF8-unsplash.jpg",
      iconBgColor: "bg-accent-600",
      attribution: {
        photographer: "GuerrillaBuzz",
        url: "https://unsplash.com/@guerrillabuzz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
        unsplashUrl: "https://unsplash.com/photos/diagram-7hA2wqBcSF8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
      },
      detailTexts: [
        "Streamline your operations with intelligent workflow automation that eliminates repetitive tasks and accelerates your business velocity. Leveraging Microsoft Power Platform and custom solutions, we create seamless workflows that connect your entire organization.",
        "From data processing to approval chains, our automation solutions reduce errors, save time, and free your team to focus on what truly matters—innovation and growth.",
      ],
    },
    {
      title: "API Integration",
      description:
        "API-based system integration to enable seamless connectivity across platforms, connecting your existing tools and services efficiently.",
      icon: HiLink,
      color: "primary",
      image: "/assets/images/api/rubaitul-azad-FPK6K5OUFVA-unsplash.jpg",
      iconBgColor: "bg-primary-600",
      attribution: {
        photographer: "Rubaitul Azad",
        url: "https://unsplash.com/@rubaitulazad?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
        unsplashUrl: "https://unsplash.com/photos/icon-FPK6K5OUFVA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
      },
      detailTexts: [
        "Connect the dots across your entire technology stack with seamless API integrations that bring your tools together in perfect harmony. Break down silos and create a unified digital ecosystem that works as one.",
        "Whether it's connecting CRM to ERP, syncing data across platforms, or building custom integrations, we ensure your systems communicate flawlessly, enabling real-time data flow and enhanced productivity.",
      ],
    },
    {
      title: "Cost Optimization",
      description:
        "Establishment of specialized teams to optimize costs across cloud and software services, maximizing your ROI and operational efficiency.",
      icon: HiCurrencyDollar,
      color: "secondary",
      image: "/assets/images/cost optimizations/jp-valery-blOLCO2K4M0-unsplash.jpg",
      iconBgColor: "bg-secondary-600",
      attribution: {
        photographer: "Jp Valery",
        url: "https://unsplash.com/@jpvalery?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
        unsplashUrl: "https://unsplash.com/photos/time-lapse-photography-of-several-burning-us-dollar-banknotes-blOLCO2K4M0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
      },
      detailTexts: [
        "Stop watching your budget burn away. Our cost optimization experts dive deep into your cloud infrastructure and software spend, identifying opportunities to reduce costs without compromising performance or capabilities.",
        "With strategic resource allocation, right-sizing recommendations, and intelligent spending analytics, we help you maximize every dollar invested in technology, turning cost centers into competitive advantages.",
      ],
    },
    {
      title: "Cybersecurity Implementation",
      description:
        "Implementation of strong cybersecurity standards as a foundational layer, ensuring your systems are protected against threats.",
      icon: HiLockClosed,
      color: "accent",
      image: "/assets/images/cybersecurity/adi-goldstein-EUsVwEOsblE-unsplash.jpg",
      iconBgColor: "bg-accent-600",
      attribution: {
        photographer: "Adi Goldstein",
        url: "https://unsplash.com/@adigold1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
        unsplashUrl: "https://unsplash.com/photos/teal-led-panel-EUsVwEOsblE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
      },
      detailTexts: [
        "Build an impenetrable digital fortress around your business with comprehensive cybersecurity implementation. We don't just patch vulnerabilities—we architect security from the ground up, creating multiple layers of protection.",
        "From threat detection and incident response to compliance and security training, our holistic approach ensures your data, systems, and reputation remain protected in an ever-evolving threat landscape.",
      ],
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

  const getBackgroundColor = (color) => {
    const colors = {
      primary: "from-primary-200/40 to-primary-300/40 dark:from-primary-700/30 dark:to-primary-800/30",
      secondary: "from-secondary-200/40 to-secondary-300/40 dark:from-secondary-700/30 dark:to-secondary-800/30",
      accent: "from-accent-200/40 to-accent-300/40 dark:from-accent-700/30 dark:to-accent-800/30",
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

  const handleServiceClick = (service, index) => {
    setSelectedService({ ...service, index });
    setIsDialogOpen(true);
    trackServiceView(service.title);
  };

  return (
    <section
      id="services"
      className="section-padding bg-white dark:bg-gray-800 relative overflow-hidden"
    >
      {/* Animated background mask */}
      {hoveredIndex !== null && (
        <motion.div
          key={hoveredIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${getBackgroundColor(
            services[hoveredIndex]?.color
          )} pointer-events-none z-0 blur-3xl`}
          style={{
            maskImage: `radial-gradient(circle 600px at center, black 20%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(circle 600px at center, black 20%, transparent 80%)`,
          }}
        />
      )}
      <div className="container-custom relative z-10" ref={ref}>
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
          {services.map((service, index) => {
            // Create ID from service title for scroll targeting
            const serviceId = service.title.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
            
            return (
            <motion.div
              key={index}
              id={serviceId}
              ref={(el) => (cardRefs.current[index] = el)}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              onHoverStart={() => {
                setHoveredIndex(index);
                trackServiceInteraction(service.title);
              }}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => handleServiceClick(service, index)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 relative z-10 cursor-pointer overflow-hidden ${getColorClasses(
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
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {service.description}
              </p>
              
              {/* Click to view more text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={hoveredIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 left-6 right-6"
              >
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-2">
                  <span>Click to explore more</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        service={selectedService}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedService(null);
        }}
      />
    </section>
  );
};

export default Services;
