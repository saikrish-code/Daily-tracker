import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Bind directly to coordinate values for normal speed position tracking

  useEffect(() => {
    // Check if device supports touch to disable custom cursor
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      )
    }
    checkTouch()

    const moveMouse = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    // Check if hovering over clickable items
    const handleMouseOver = (e) => {
      const target = e.target
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.classList.contains('clickable')

      setIsHovered(!!isClickable)
    }

    window.addEventListener('mousemove', moveMouse)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', moveMouse)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY, isVisible])

  if (isTouchDevice || !isVisible) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        translateX: '-30%',
        translateY: '-30%',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        animate={{
          scale: isHovered ? 1.4 : 1.0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {/* Draw a sleek, violet triangular pointer */}
        <polygon
          points="4,3 19,10 11,13 4,20"
          fill={isHovered ? '#A78BFA' : 'transparent'}
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  )
}
