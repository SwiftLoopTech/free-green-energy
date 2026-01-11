import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const hamburgerVariants = {
    closed: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3 },
    },
    open: {
      rotate: 90,
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <nav className="sticky top-0 left-0 w-full bg-white z-50 shadow-md">
      <div className="py-4 px-6 flex items-center justify-between">
        {/* Company logo */}
        <div>
          <Link href="/">
            <Image
              height={32}
              width={64}
              src="/images/logo2.png"
              alt="Company Logo"
            />
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <motion.button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
            variants={hamburgerVariants}
            animate={isMenuOpen ? "open" : "closed"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Navigation links - Desktop */}
        <ul className="hidden md:flex gap-12">
          <li>
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/homeowners"
              className="hover:text-secondary transition-colors"
            >
              Homeowners
            </Link>
          </li>
          <li>
            <Link
              href="/business-owners"
              className="hover:text-secondary transition-colors"
            >
              Business owners
            </Link>
          </li>
        </ul>

        {/* Get our product button - Desktop */}
        <button className="hidden md:block btn-primary">Get our product</button>
      </div>

      {/* Mobile Menu Overlay with Framer Motion Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-full left-0 w-full bg-white md:hidden shadow-lg overflow-hidden"
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              <li>
                <Link
                  href="/"
                  onClick={toggleMenu}
                  className="hover:text-secondary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/homeowners"
                  onClick={toggleMenu}
                  className="hover:text-secondary transition-colors"
                >
                  Homeowners
                </Link>
              </li>
              <li>
                <Link
                  href="/business-owners"
                  onClick={toggleMenu}
                  className="hover:text-secondary transition-colors"
                >
                  Business owners
                </Link>
              </li>
              <li>
                <button className="btn-primary" onClick={toggleMenu}>
                  Get our product
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
