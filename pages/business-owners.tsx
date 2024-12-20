import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Animation variants for scroll reveal
const sectionVariants = {
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

const Business: React.FC = () => {
  // Bento grid content with unique descriptions
  const bentoGridContent = [
    {
      title: "Safety first",
      description:
        "Our Microinverter design prioritizes safety with a unique approach that eliminates high-voltage DC power risks.",
    },
    {
      title: "Certified for rain or shine",
      description:
        "IP67 certification ensures our inverters withstand extreme weather conditions with double-insulated, corrosion-resistant housing.",
    },
    {
      title: "Responsive and responsible",
      description:
        "Built-in rapid shutdown technology provides instant power cutoff, ensuring safety for utility workers and first responders.",
    },
    {
      title: "Future-proof technology",
      description:
        "Scalable and adaptable energy solutions that grow with your business's evolving energy needs.",
    },
  ];

  // Refs for scroll animations
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const bentoGridRef = useRef(null);

  // Intersection observers for scroll reveal
  const heroInView = useInView(heroRef, { once: true });
  const aboutInView = useInView(aboutRef, { once: true });
  const bentoGridInView = useInView(bentoGridRef, { once: true });

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Scroll Reveal */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={sectionVariants}
        className="rounded-lg bg-cover bg-center h-[70vh] flex flex-col justify-center items-center text-white p-4"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url('/images/business-hero.jpg')",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: heroInView ? 1 : 0, scale: heroInView ? 1 : 0.9 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-8xl font-medium mb-4 sm:w-1/2 text-center sm:leading-[107px]"
        >
          We're perfect for your business
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-4"
        >
          <button className="btn-primary">System Estimator</button>
        </motion.div>
      </motion.div>

      {/* About Section with Scroll Reveal */}
      <motion.div
        ref={aboutRef}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
        variants={sectionVariants}
        className="container mx-auto py-16 flex flex-col md:flex-row items-center"
      >
        <div className="md:w-1/2 p-4">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: aboutInView ? 1 : 0, x: aboutInView ? 0 : -50 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-4"
          >
            Safe, smart, and powerful energy systems for business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: aboutInView ? 1 : 0, x: aboutInView ? 0 : 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[16px]"
          >
            The Commercial Enphase Energy System lowers reliance on the power
            grid, saves money on operating costs, and allows you to scale your
            future energy needs. With safety at the forefront, we offer peace of
            mind for sensitive sites like gas stations, firehouses, schools,
            multi-family units, hospitals, warehouses, and more.
          </motion.p>
        </div>
      </motion.div>

      {/* Bento Grid with Scroll Reveal */}
      <motion.div
        ref={bentoGridRef}
        initial="hidden"
        animate={bentoGridInView ? "visible" : "hidden"}
        variants={sectionVariants}
        className="container mx-auto flex flex-col sm:grid sm:grid-cols-2 gap-4 py-16  "
      >
        {bentoGridContent.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: bentoGridInView ? 1 : 0,
              scale: bentoGridInView ? 1 : 0.9,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
            }}
            className="bento-box"
          >
            <h3 className="text-5xl font-medium leading-[64.8px]">
              {item.title}
            </h3>
            <p className="text-[16px] font-medium">{item.description}</p>
          </motion.div>
        ))}

        {/* Full Width Bento Box with Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: bentoGridInView ? 1 : 0,
            y: bentoGridInView ? 0 : 50,
          }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-black rounded-lg text-white px-10 sm:px-14 flex sm:pr-0 py-10 sm:py-0 col-span-2 h-fit sm:h-[443px]"
        >
          <div className="sm:w-1/2 sm:py-20">
            <h3 className="text-5xl font-medium mb-4">Better over time</h3>
            <p className="text-[16px] font-medium sm:w-3/5">
              Get free over-the-air software updates that bring innovative new
              features to your solar system and the Enphase App.
            </p>
          </div>
          <div
            className="hidden sm:block w-1/2 bg-cover bg-center h-full rounded-r-lg"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0.3)), url('/images/solar-2-bg.jpg')",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Business;
