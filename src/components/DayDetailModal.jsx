import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Code, Dumbbell, BookOpen, AlertCircle } from 'lucide-react'
import Github from './GithubIcon'

export default function DayDetailModal({ isOpen, onClose, date, dayData }) {
  const shouldReduceMotion = useReducedMotion()

  if (!date) return null

  const goals = dayData?.goals || []
  const dsaProblems = dayData?.dsaProblems || []
  const githubCommits = dayData?.githubCommits || []
  const workoutHabit = dayData?.habits?.find(h => h.name === 'workout')
  const journal = dayData?.journal || {}

  // Calculate completion
  let totalTarget = 0
  let totalDone = 0
  goals.forEach(g => {
    totalTarget += g.target
    totalDone += Math.min(g.done, g.target)
  })
  const percent = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0

  // 3D Fall & Bounce spring transition parameters
  const springTransition = {
    type: 'spring',
    damping: 12,     // 10-14 for bounces
    stiffness: 150,  // 120-180
    mass: 1.1        // simulated weight
  }

  // Animation variants
  const cardVariants = {
    initial: shouldReduceMotion 
      ? { opacity: 0, scale: 0.95, y: 0, rotate: 0 } 
      : { y: '-120vh', rotate: Math.random() * 10 - 5, scale: 0.9, opacity: 0 },
    animate: {
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0.2 } : springTransition
    },
    exit: {
      y: shouldReduceMotion ? 0 : '-100vh',
      rotate: shouldReduceMotion ? 0 : -3,
      scale: shouldReduceMotion ? 0.95 : 0.9,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeInOut' }
    }
  }

  // Shadow variant mimicking altitude depth
  const shadowVariants = {
    initial: { boxShadow: '0 5px 15px rgba(139, 92, 246, 0.05)' },
    animate: { 
      boxShadow: '0 30px 60px -15px rgba(139, 92, 246, 0.35)',
      transition: { delay: 0.1, duration: 0.4 } 
    },
    exit: { boxShadow: '0 5px 15px rgba(139, 92, 246, 0.05)' }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fading blurred glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 glass-overlay"
          />

          {/* Modal Container */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-xl bg-[#211F2C] border border-[#34313F] rounded-3xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Custom shadow overlay block to animate shadow separately */}
            <motion.div 
              variants={shadowVariants} 
              className="absolute inset-0 pointer-events-none rounded-3xl" 
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-6 shrink-0 relative z-20">
              <div>
                <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-widest">Day Detail Logs</span>
                <h3 className="font-outfit text-2xl font-black text-[#F5F4F7] mt-0.5">{date}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-[#2A2836] border border-[#34313F]/50 rounded-xl text-[#9B98AA] hover:text-[#F5F4F7] transition-all clickable"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 relative z-20">
              
              {/* Progress Summary */}
              <div className="bg-[#2A2836]/60 border border-[#34313F]/50 rounded-2xl p-4 flex items-center gap-5">
                <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="#2E2B3B" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#8B5CF6"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={(2 * Math.PI * 26) - (percent / 100) * (2 * Math.PI * 26)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-outfit text-sm font-bold text-[#F5F4F7]">{percent}%</span>
                </div>
                <div>
                  <h4 className="font-outfit text-base font-bold text-[#F5F4F7]">Goals Completion</h4>
                  <p className="text-xs text-[#9B98AA]">
                    Completed {totalDone} of {totalTarget} target checkpoints.
                  </p>
                </div>
              </div>

              {/* Goal Checklist */}
              {goals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider">Today's Targets</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {goals.map(g => (
                      <div 
                        key={g.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          g.done >= g.target 
                            ? 'bg-violet-600/10 border-violet-500/30 text-[#F5F4F7]' 
                            : 'bg-[#2A2836]/30 border-[#34313F]/30 text-[#9B98AA]'
                        }`}
                      >
                        <span className="truncate pr-2 font-medium">{g.label}</span>
                        <span className="font-mono bg-[#1E1C29] px-2 py-0.5 rounded border border-[#34313F]/40 font-bold shrink-0">
                          {g.done}/{g.target}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Journal */}
              <div className="bg-[#2A2836]/20 border border-[#34313F]/40 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-pink-400" /> Reflection Journal
                  </h4>
                  {journal.mood && (
                    <span className="text-xl bg-[#2A2836] p-1.5 px-3 rounded-xl border border-[#34313F]/50">
                      {journal.mood} Mood
                    </span>
                  )}
                </div>
                {journal.text ? (
                  <p className="text-sm text-[#F5F4F7] leading-relaxed italic bg-[#1E1C29]/30 p-3 rounded-xl border border-[#34313F]/20">
                    "{journal.text}"
                  </p>
                ) : (
                  <p className="text-xs text-[#9B98AA] italic text-center py-4 bg-[#1E1C29]/20 rounded-xl">
                    No journal entry logged for this day.
                  </p>
                )}
              </div>

              {/* DSA Solutions */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider flex items-center gap-1.5">
                  <Code size={14} className="text-amber-400" /> Solved DSA Problems ({dsaProblems.length})
                </h4>
                {dsaProblems.length > 0 ? (
                  <div className="space-y-2">
                    {dsaProblems.map((prob, i) => (
                      <div key={i} className="flex justify-between items-center bg-[#2A2836]/40 border border-[#34313F]/30 p-3 rounded-xl">
                        <span className="text-sm text-[#F5F4F7] font-medium truncate max-w-[70%]">{prob.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9B98AA] italic text-center py-3 bg-[#1E1C29]/20 rounded-xl">
                    No algorithm problems solved.
                  </p>
                )}
              </div>

              {/* GitHub Commits */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider flex items-center gap-1.5">
                  <Github size={14} className="text-indigo-400" /> GitHub Activity ({githubCommits.length} commits)
                </h4>
                {githubCommits.length > 0 ? (
                  <div className="space-y-2">
                    {githubCommits.map((commit, i) => (
                      <div key={i} className="bg-[#2A2836]/40 border border-[#34313F]/30 p-3 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center text-[#F5F4F7] font-medium">
                          <span className="text-[#A78BFA] truncate max-w-[60%]">{commit.repo}</span>
                          <span className="text-[10px] text-[#9B98AA]">Commit</span>
                        </div>
                        <p className="text-[#9B98AA] truncate">{commit.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9B98AA] italic text-center py-3 bg-[#1E1C29]/20 rounded-xl">
                    No commits logged.
                  </p>
                )}
              </div>

              {/* Workout habit */}
              <div className="bg-[#2A2836]/20 border border-[#34313F]/40 rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Dumbbell size={14} className="text-emerald-400" /> Workout Summary
                </h4>
                {workoutHabit && workoutHabit.minutes > 0 ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#F5F4F7] font-medium">Cardio / Gym session</span>
                    <span className="font-mono text-[#A78BFA] font-bold">
                      {workoutHabit.minutes} / {workoutHabit.target} min completed
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#9B98AA] italic text-center py-2">
                    No workouts logged on this day.
                  </p>
                )}
              </div>
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
