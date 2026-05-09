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
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm w-full">
      {/* Navigation Bar */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Fixed sizing */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-fit">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-base sm:text-lg text-primary-600 whitespace-nowrap">
              Cappai
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <Link href="#features" className="text-gray-700 hover:text-primary-600 transition-colors text-sm lg:text-base font-medium">
              Features
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-primary-600 transition-colors text-sm lg:text-base font-medium">
              Services
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors text-sm lg:text-base font-medium">
              Preise
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors text-sm lg:text-base font-medium">
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
              className="w-6 h-6 text-gray-900"
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
            className="md:hidden overflow-hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 sm:px-6 py-4 space-y-2">
              <Link
                href="#features"
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#services"
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#pricing"
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preise
              </Link>
              <Link
                href="#contact"
                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-medium text-base"
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
