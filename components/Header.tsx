'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <nav className="container-max flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="font-bold text-lg text-gray-900">Cappai</span>
        </Link>

        <button
          className="sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`hidden sm:flex items-center gap-8 ${mobileMenuOpen ? 'flex flex-col absolute top-16 left-0 right-0 bg-white border-b p-4 gap-4' : ''}`}>
          <Link href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
            Features
          </Link>
          <Link href="#services" className="text-gray-700 hover:text-primary-600 transition-colors">
            Services
          </Link>
          <Link href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
            Preise
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
            Kontakt
          </Link>
        </div>
      </nav>
    </header>
  )
}
