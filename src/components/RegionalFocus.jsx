import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { HiChartBar, HiGlobeAlt, HiSparkles } from "react-icons/hi2";
import { MdGpsFixed } from "react-icons/md";

const RegionalFocus = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <HiGlobeAlt className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Regional Focus: South Africa
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            We focus on sourcing and analyzing public data relevant to South
            Africa and surrounding regions. Our AI-powered systems predict
            trends and continuously generate tailored solutions for local
            challenges, with data as the central driver of innovation.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="mb-3">
                <HiChartBar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Data-Driven</h3>
              <p className="text-white/80 text-sm">
                Public data analysis for informed decision-making
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="mb-3">
                <HiSparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Trend Prediction</h3>
              <p className="text-white/80 text-sm">
                AI-powered forecasting for regional trends
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="mb-3">
                <MdGpsFixed className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Local Solutions</h3>
              <p className="text-white/80 text-sm">
                Tailored solutions for South African challenges
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RegionalFocus;
