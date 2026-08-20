import React from 'react'

// Sparkle doodle
export function Sparkle({ className = '', style = {} }) {
  return (
    <svg
      className={`animate-doodle w-6 h-6 text-[#A78BFA] opacity-60 pointer-events-none select-none ${className}`}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
    </svg>
  )
}

// Squiggle line doodle
export function Squiggle({ className = '', style = {} }) {
  return (
    <svg
      className={`animate-doodle-slow w-12 h-4 text-[#8B5CF6] opacity-40 pointer-events-none select-none ${className}`}
      style={style}
      viewBox="0 0 100 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d="M5,10 C15,0 20,20 30,10 C40,0 45,20 55,10 C65,0 70,20 80,10 C90,0 95,20 105,10" />
    </svg>
  )
}

// Arrow doodle pointing to empty logs
export function Arrow({ className = '', style = {} }) {
  return (
    <svg
      className={`animate-doodle w-8 h-8 text-[#A78BFA] opacity-50 pointer-events-none select-none ${className}`}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h18M15 6l6 6-6 6" />
    </svg>
  )
}

// Star doodle
export function Star({ className = '', style = {} }) {
  return (
    <svg
      className={`animate-doodle-fast w-8 h-8 text-[#7C5CFC] opacity-50 pointer-events-none select-none ${className}`}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
