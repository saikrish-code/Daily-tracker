import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Timer } from 'lucide-react'
import { useStore } from '../store'
import { differenceInSeconds, endOfDay } from 'date-fns'

export default function CountdownProgress({ onEditGoals, date }) {
  const { dailyData } = useStore()
  
  const [timeLeft, setTimeLeft] = useState('')

  // Live countdown to midnight
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Use local timezone midnight
      const midnight = endOfDay(now)
      const secondsLeft = differenceInSeconds(midnight, now)
      
      if (secondsLeft <= 0) {
        setTimeLeft('0 hr 0 min left')
        return
      }

      const hrs = Math.floor(secondsLeft / 3600)
      const mins = Math.floor((secondsLeft % 3600) / 60)
      setTimeLeft(`${hrs}h ${mins}m left`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Retrieve today's data
  const dayData = dailyData[date] || {}
  const goals = dayData.goals || []

  // Calculate completion percentage
  let totalTarget = 0
  let totalDone = 0

  goals.forEach(g => {
    totalTarget += g.target
    totalDone += Math.min(g.done, g.target)
  })

  const percent = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0

  // SVG ring configs
  const radius = 54
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  // SVG offset (strokeDashoffset = circumference - (percent/100)*circumference)
  const strokeDashoffset = circumference - (percent / 100) * circumference

  // DSA, GitHub, Workout, Journal labels
  const dsaGoal = goals.find(g => g.type === 'dsa')
  const gitGoal = goals.find(g => g.type === 'github')
  const workoutGoal = goals.find(g => g.type === 'workout')

  return (
    <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider">Today's Focus</span>
          <h3 className="font-outfit text-lg font-bold text-[#F5F4F7] mt-0.5">Daily Completion</h3>
        </div>
        <button
          onClick={onEditGoals}
          className="p-2 hover:bg-[#2A2836] border border-[#34313F]/50 rounded-xl text-[#9B98AA] hover:text-[#F5F4F7] transition-all clickable"
          title="Edit goals"
        >
          <Edit2 size={15} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
        {/* Radial progress ring */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#2E2B3B"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
            />
            {/* Animated progress ring */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ type: 'spring', damping: 14, stiffness: 120 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          {/* Central percentage text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-outfit text-2xl font-extrabold text-[#F5F4F7]">{percent}%</span>
            <span className="text-[10px] font-medium text-[#9B98AA] uppercase tracking-widest">Done</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="flex-1 space-y-3 w-full">
          {/* Live countdown */}
          <div className="flex items-center gap-2 text-[#9B98AA] bg-[#2A2836]/60 border border-[#34313F]/30 px-3 py-2 rounded-xl text-sm">
            <Timer size={16} className="text-[#8B5CF6] shrink-0" />
            <span className="font-mono text-[#F5F4F7] font-medium">{timeLeft}</span>
          </div>

          <div className="space-y-2 text-xs text-[#9B98AA] bg-[#2A2836]/30 p-3 rounded-xl border border-[#34313F]/20">
            {dsaGoal && (
              <div className="flex justify-between items-center">
                <span>💻 DSA Problems</span>
                <span className="font-mono text-[#F5F4F7] font-semibold">{dsaGoal.done}/{dsaGoal.target}</span>
              </div>
            )}
            {gitGoal && (
              <div className="flex justify-between items-center border-t border-[#34313F]/30 pt-1.5 mt-1.5">
                <span>🐙 GitHub Commits</span>
                <span className="font-mono text-[#F5F4F7] font-semibold">{gitGoal.done}/{gitGoal.target}</span>
              </div>
            )}
            {workoutGoal && (
              <div className="flex justify-between items-center border-t border-[#34313F]/30 pt-1.5 mt-1.5">
                <span>💪 Workouts</span>
                <span className="font-mono text-[#F5F4F7] font-semibold">{workoutGoal.done}/{workoutGoal.target}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
