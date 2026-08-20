import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash, Check, X, Code, Dumbbell, BookOpen } from 'lucide-react'
import Github from './GithubIcon'
import { useStore } from '../store'

export default function GoalModal({ isOpen, onClose, date }) {
  const { dailyData, setGoalsForDate } = useStore()
  
  const [dsaTarget, setDsaTarget] = useState(2)
  const [gitTarget, setGitTarget] = useState(3)
  const [workoutTarget, setWorkoutTarget] = useState(30)
  const [journalPlanned, setJournalPlanned] = useState(true)
  const [customGoals, setCustomGoals] = useState([])
  const [newCustomLabel, setNewCustomLabel] = useState('')

  // Load existing goals if available
  useEffect(() => {
    if (isOpen && date) {
      const dayData = dailyData[date]
      if (dayData && dayData.goals && dayData.goals.length > 0) {
        const dsaGoal = dayData.goals.find(g => g.type === 'dsa')
        const gitGoal = dayData.goals.find(g => g.type === 'github')
        const workoutGoal = dayData.goals.find(g => g.type === 'workout')
        const journalGoal = dayData.goals.find(g => g.type === 'journal')
        
        if (dsaGoal) setDsaTarget(dsaGoal.target)
        if (gitGoal) setGitTarget(gitGoal.target)
        if (workoutGoal) setWorkoutTarget(workoutGoal.target)
        if (journalGoal) setJournalPlanned(journalGoal.target > 0)
        
        const customs = dayData.goals.filter(g => g.type === 'custom')
        setCustomGoals(customs)
      } else {
        // Fallback defaults
        setDsaTarget(2)
        setGitTarget(3)
        setWorkoutTarget(30)
        setJournalPlanned(true)
        setCustomGoals([])
      }
    }
  }, [isOpen, date, dailyData])

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (!newCustomLabel.trim()) return
    const newGoal = {
      id: `custom_${Date.now()}`,
      type: 'custom',
      label: newCustomLabel.trim(),
      target: 1,
      done: 0
    }
    setCustomGoals([...customGoals, newGoal])
    setNewCustomLabel('')
  }

  const handleRemoveCustom = (id) => {
    setCustomGoals(customGoals.filter(g => g.id !== id))
  }

  const handleSave = () => {
    const goalsList = [
      { id: '1', type: 'dsa', label: 'Solve DSA problems', target: dsaTarget, done: 0 },
      { id: '2', type: 'github', label: 'GitHub commits / PRs', target: gitTarget, done: 0 },
      { id: '3', type: 'workout', label: 'Workout minutes', target: workoutTarget, done: 0 },
      { id: '4', type: 'journal', label: 'Write daily journal', target: journalPlanned ? 1 : 0, done: 0 },
      ...customGoals
    ]
    setGoalsForDate(date, goalsList)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 glass-overlay"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-lg bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-outfit text-xl font-bold text-[#F5F4F7]">Set Daily Targets</h3>
                <p className="text-sm text-[#9B98AA]">Personalize your goals for {date}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#2A2836] rounded-xl text-[#9B98AA] hover:text-[#F5F4F7] transition-all clickable"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              {/* LeetCode Stepper */}
              <div className="flex items-center justify-between p-3 bg-[#2A2836] rounded-xl border border-[#34313F]/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Code size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#F5F4F7]">LeetCode / DSA</h4>
                    <p className="text-xs text-[#9B98AA]">Problems targeted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDsaTarget(Math.max(0, dsaTarget - 1))}
                    className="w-8 h-8 rounded-lg bg-[#211F2C] border border-[#34313F] flex items-center justify-center text-[#F5F4F7] hover:border-[#8B5CF6] transition-all clickable"
                  >
                    -
                  </button>
                  <span className="font-outfit text-base font-semibold text-[#F5F4F7] w-6 text-center">{dsaTarget}</span>
                  <button
                    onClick={() => setDsaTarget(dsaTarget + 1)}
                    className="w-8 h-8 rounded-lg bg-[#211F2C] border border-[#34313F] flex items-center justify-center text-[#F5F4F7] hover:border-[#8B5CF6] transition-all clickable"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* GitHub Commits Stepper */}
              <div className="flex items-center justify-between p-3 bg-[#2A2836] rounded-xl border border-[#34313F]/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Github size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#F5F4F7]">GitHub Activity</h4>
                    <p className="text-xs text-[#9B98AA]">Commits / PRs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGitTarget(Math.max(0, gitTarget - 1))}
                    className="w-8 h-8 rounded-lg bg-[#211F2C] border border-[#34313F] flex items-center justify-center text-[#F5F4F7] hover:border-[#8B5CF6] transition-all clickable"
                  >
                    -
                  </button>
                  <span className="font-outfit text-base font-semibold text-[#F5F4F7] w-6 text-center">{gitTarget}</span>
                  <button
                    onClick={() => setGitTarget(gitTarget + 1)}
                    className="w-8 h-8 rounded-lg bg-[#211F2C] border border-[#34313F] flex items-center justify-center text-[#F5F4F7] hover:border-[#8B5CF6] transition-all clickable"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Workout Minutes Stepper */}
              <div className="flex items-center justify-between p-3 bg-[#2A2836] rounded-xl border border-[#34313F]/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#F5F4F7]">Workout Goals</h4>
                    <p className="text-xs text-[#9B98AA]">Active minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWorkoutTarget(Math.max(0, workoutTarget - 5))}
                    className="w-8 h-8 rounded-lg bg-[#211F2C] border border-[#34313F] flex items-center justify-center text-[#F5F4F7] hover:border-[#8B5CF6] transition-all clickable"
                  >
                    -5
                  </button>
                  <span className="font-outfit text-sm font-semibold text-[#F5F4F7] w-12 text-center">{workoutTarget}m</span>
                  <button
                    onClick={() => setWorkoutTarget(workoutTarget + 5)}
                    className="w-8 h-8 rounded-lg bg-[#211F2C] border border-[#34313F] flex items-center justify-center text-[#F5F4F7] hover:border-[#8B5CF6] transition-all clickable"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* Journal Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#2A2836] rounded-xl border border-[#34313F]/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#F5F4F7]">Journal Entry</h4>
                    <p className="text-xs text-[#9B98AA]">Plan to write a note today</p>
                  </div>
                </div>
                <button
                  onClick={() => setJournalPlanned(!journalPlanned)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center clickable ${
                    journalPlanned ? 'bg-[#8B5CF6] justify-end' : 'bg-[#34313F] justify-start'
                  }`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Custom To-Dos */}
              <div>
                <h4 className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider mb-2">Custom Daily Checklist</h4>
                <form onSubmit={handleAddCustom} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newCustomLabel}
                    onChange={(e) => setNewCustomLabel(e.target.value)}
                    placeholder="E.g., Read 10 pages, practice Rust..."
                    className="flex-1 bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6] transition-all"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl transition-all flex items-center justify-center clickable"
                  >
                    <Plus size={18} />
                  </button>
                </form>

                <div className="space-y-2">
                  {customGoals.map((g) => (
                    <div key={g.id} className="flex items-center justify-between p-2.5 bg-[#2A2836]/40 border border-[#34313F]/30 rounded-xl">
                      <span className="text-sm text-[#F5F4F7] truncate max-w-[80%]">{g.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustom(g.id)}
                        className="p-1 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-all clickable"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                  {customGoals.length === 0 && (
                    <p className="text-xs text-[#9B98AA] text-center py-2 italic">No custom targets added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-[#34313F] text-[#9B98AA] hover:text-[#F5F4F7] hover:bg-[#2A2836] rounded-xl font-medium transition-all text-sm clickable"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] hover:brightness-110 text-white rounded-xl font-semibold transition-all text-sm shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 clickable"
              >
                <Check size={18} /> Save & Launch
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
