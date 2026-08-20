import React, { useState } from 'react'
import { useStore } from '../store'
import { Code, Dumbbell, BookOpen, Settings, Plus, RotateCcw, ShieldCheck } from 'lucide-react'
import Github from './GithubIcon'

// --- DSA / LeetCode Screen ---
export function DsaScreen({ date }) {
  const { dailyData, addDsaProblem } = useStore()
  const [title, setTitle] = useState('')
  const [diff, setDiff] = useState('Easy')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addDsaProblem(date, title.trim(), diff, url.trim() || 'https://leetcode.com/problems/')
    setTitle('')
    setUrl('')
  }

  const dayData = dailyData[date] || {}
  const dsaList = dayData.dsaProblems || []

  return (
    <div className="space-y-6">
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-lg font-bold text-[#F5F4F7] mb-4 flex items-center gap-2">
          <Code className="text-amber-400" /> Log LeetCode / DSA Problem
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#9B98AA] font-semibold">Problem Title</label>
              <input
                type="text"
                required
                placeholder="E.g., Two Sum"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2.5 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#9B98AA] font-semibold">Difficulty Level</label>
              <select
                value={diff}
                onChange={e => setDiff(e.target.value)}
                className="bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2.5 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#9B98AA] font-semibold">Problem Link (Optional)</label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2.5 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-semibold rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-violet-500/20 clickable"
          >
            Add Problem
          </button>
        </form>
      </div>

      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-base font-bold text-[#F5F4F7] mb-3">Today's Solved Problems ({dsaList.length})</h3>
        <div className="space-y-3">
          {dsaList.map((prob, idx) => (
            <div key={idx} className="flex justify-between items-center bg-[#2A2836]/40 border border-[#34313F]/30 p-3.5 rounded-xl">
              <div>
                <h4 className="text-sm font-semibold text-[#F5F4F7]">{prob.title}</h4>
                {prob.url && (
                  <a href={prob.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#A78BFA] hover:underline clickable">
                    View problem link
                  </a>
                )}
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {prob.difficulty}
              </span>
            </div>
          ))}
          {dsaList.length === 0 && (
            <p className="text-xs text-[#9B98AA] text-center py-6 italic bg-[#1E1C29]/20 rounded-xl border border-dashed border-[#34313F]/50">
              No problems logged for today. Work hard, solve one!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// --- GitHub Commits Screen ---
export function GithubScreen({ date }) {
  const { dailyData, addGithubCommit } = useStore()
  const [repo, setRepo] = useState('')
  const [msg, setMsg] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!repo.trim() || !msg.trim()) return
    addGithubCommit(date, repo.trim(), msg.trim(), url.trim() || 'https://github.com')
    setRepo('')
    setMsg('')
    setUrl('')
  }

  const dayData = dailyData[date] || {}
  const commitList = dayData.githubCommits || []

  return (
    <div className="space-y-6">
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-lg font-bold text-[#F5F4F7] mb-4 flex items-center gap-2">
          <Github className="text-indigo-400" /> Log GitHub Activity
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#9B98AA] font-semibold">Repository Name</label>
            <input
              type="text"
              required
              placeholder="E.g., pulsetrack-dashboard"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              className="bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2.5 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#9B98AA] font-semibold">Commit Message</label>
            <input
              type="text"
              required
              placeholder="E.g., implement spring animations in DayDetail modal"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              className="bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2.5 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#9B98AA] font-semibold">PR or Commit URL (Optional)</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="bg-[#2A2836] border border-[#34313F] rounded-xl px-3 py-2.5 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-semibold rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-violet-500/20 clickable"
          >
            Add Commit
          </button>
        </form>
      </div>

      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-base font-bold text-[#F5F4F7] mb-3">Today's Push Activity ({commitList.length})</h3>
        <div className="space-y-3">
          {commitList.map((commit, idx) => (
            <div key={idx} className="bg-[#2A2836]/40 border border-[#34313F]/30 p-3.5 rounded-xl text-sm space-y-1.5">
              <div className="flex justify-between items-center text-[#F5F4F7]">
                <span className="font-bold text-[#A78BFA]">{commit.repo}</span>
                {commit.url && (
                  <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#9B98AA] hover:underline hover:text-[#F5F4F7] clickable">
                    Diff Link
                  </a>
                )}
              </div>
              <p className="text-xs text-[#9B98AA]">{commit.message}</p>
            </div>
          ))}
          {commitList.length === 0 && (
            <p className="text-xs text-[#9B98AA] text-center py-6 italic bg-[#1E1C29]/20 rounded-xl border border-dashed border-[#34313F]/50">
              No commit activity logged for today. Git push origin main!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Habits / Workout Screen ---
export function HabitsScreen({ date }) {
  const { dailyData, updateWorkoutMinutes } = useStore()
  
  const dayData = dailyData[date] || {}
  const workoutHabit = dayData.habits?.find(h => h.name === 'workout') || { minutes: 0, target: 30 }

  const [mins, setMins] = useState(workoutHabit.minutes)

  const handleUpdate = () => {
    updateWorkoutMinutes(date, parseInt(mins) || 0)
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-lg font-bold text-[#F5F4F7] mb-4 flex items-center gap-2">
          <Dumbbell className="text-emerald-400" /> Track Daily Workout
        </h3>
        
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#9B98AA] font-semibold">Active Workout Time</span>
              <span className="font-mono text-[#F5F4F7] font-bold">{mins} minutes</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={mins}
              onChange={e => setMins(e.target.value)}
              className="w-full accent-[#8B5CF6] h-2 bg-[#2A2836] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9B98AA] font-mono mt-1">
              <span>0m (Rest)</span>
              <span>30m</span>
              <span>60m (Standard)</span>
              <span>90m</span>
              <span>120m+</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
            Target minutes set for today: <strong className="font-mono">{workoutHabit.target} min</strong>. 
            Logging {mins}m will complete <strong className="font-mono">{Math.round((Math.min(mins, workoutHabit.target) / workoutHabit.target) * 100)}%</strong> of today's fitness goal.
          </div>

          <button
            onClick={handleUpdate}
            className="w-full py-3 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-semibold rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-violet-500/20 clickable"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Daily Journaling Screen ---
export function JournalScreen({ date }) {
  const { dailyData, updateJournal } = useStore()
  
  const dayData = dailyData[date] || {}
  const journal = dayData.journal || { text: '', mood: '' }

  const [text, setText] = useState(journal.text)
  const [selectedMood, setSelectedMood] = useState(journal.mood || '😊')

  const moodsList = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '🤩', label: 'Excited' },
    { emoji: '🎯', label: 'Focused' },
    { emoji: '🥱', label: 'Tired' },
    { emoji: '🧘', label: 'Calm' },
    { emoji: '🔥', label: 'Fired Up' },
    { emoji: '💪', label: 'Strong' }
  ]

  const handleSave = () => {
    updateJournal(date, text, selectedMood)
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-lg font-bold text-[#F5F4F7] mb-4 flex items-center gap-2">
          <BookOpen className="text-pink-400" /> Reflection Journal
        </h3>

        <div className="space-y-5">
          {/* Mood selection */}
          <div className="space-y-2">
            <label className="text-xs text-[#9B98AA] font-semibold">Select Today's Mood</label>
            <div className="flex flex-wrap gap-2">
              {moodsList.map(m => (
                <button
                  key={m.emoji}
                  onClick={() => setSelectedMood(m.emoji)}
                  className={`p-2.5 rounded-xl border text-xl flex items-center justify-center transition-all clickable ${
                    selectedMood === m.emoji
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400 scale-110 shadow-md'
                      : 'bg-[#2A2836] border-[#34313F] hover:border-[#9B98AA]/50 text-[#F5F4F7]'
                  }`}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Text editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#9B98AA] font-semibold">What did you achieve, feel, or learn today?</label>
            <textarea
              rows="6"
              placeholder="Reflect on your day..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="bg-[#2A2836] border border-[#34313F] rounded-xl px-4 py-3 text-sm text-[#F5F4F7] focus:outline-none focus:border-[#8B5CF6] resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-semibold rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-violet-500/20 clickable"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Settings Screen ---
export function SettingsScreen() {
  const resetStorage = () => {
    localStorage.removeItem('pulsetrack-storage')
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <h3 className="font-outfit text-lg font-bold text-[#F5F4F7] mb-4 flex items-center gap-2">
          <Settings className="text-[#9B98AA]" /> Dashboard Settings
        </h3>

        <div className="space-y-5">
          <div className="flex justify-between items-center p-4 bg-[#2A2836]/40 border border-[#34313F]/40 rounded-xl">
            <div>
              <h4 className="text-sm font-semibold text-[#F5F4F7]">Premium Core Status</h4>
              <p className="text-xs text-[#9B98AA]">Verify security of your local storage logs</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              <ShieldCheck size={12} /> Local Persisted
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
            <div>
              <h4 className="text-sm font-semibold text-[#F87171]">Reset Tracker Database</h4>
              <p className="text-xs text-[#9B98AA]">Delete local logs and restart default seed</p>
            </div>
            <button
              onClick={resetStorage}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[#F87171] hover:text-red-400 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 clickable"
            >
              <RotateCcw size={14} /> Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
