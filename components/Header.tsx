'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  }

  return (
    <header className="sticky top-0 bg-soft-white border-b border-gray-100 z-50 shadow-sm w-full">
      {/* Navigation Bar */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Fixed sizing */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 min-w-fit">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="2.5" fill="white"/>
                <circle cx="16" cy="14" r="2.5" fill="white"/>
                <circle cx="12" cy="20" r="2.5" fill="white"/>
                <circle cx="8" cy="14" r="2.5" fill="white"/>
                <path d="M12 8 Q14 10 16 14 Q14 18 12 20 Q10 18 8 14 Q10 10 12 8" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <span className="font-bold text-base sm:text-lg text-navy whitespace-nowrap">
              OPTIMIZED
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <Link href="#features" className="text-gray-700 hover:text-accent transition-colors text-sm lg:text-base font-medium">
              Features
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-accent transition-colors text-sm lg:text-base font-medium">
              Services
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-accent transition-colors text-sm lg:text-base font-medium">
              Preise
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-accent transition-colors text-sm lg:text-base font-medium">
              Kontakt
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6 text-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-soft-white"
          >
            <div className="px-4 sm:px-6 py-4 space-y-2">
              <Link
                href="#features"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-accent rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#services"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-accent rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#pricing"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-accent rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preise
              </Link>
              <Link
                href="#contact"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-accent rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
