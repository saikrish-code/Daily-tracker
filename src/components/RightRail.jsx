import React from 'react'
import CalendarModule from './CalendarModule'
import { useStore, BADGES } from '../store'
import { Award, CheckCircle2, ChevronRight, Activity, Calendar } from 'lucide-react'

export default function RightRail({ date, onSelectDay }) {
  const { dailyData, unlockedBadges } = useStore()
  
  const todayLogs = dailyData[date] || {}
  const dsaProblems = todayLogs.dsaProblems || []
  const githubCommits = todayLogs.githubCommits || []
  const workoutHabit = todayLogs.habits?.find(h => h.name === 'workout')
  const journalText = todayLogs.journal?.text || ''

  // Filter activities to list in the feeds
  const activityFeed = []
  
  dsaProblems.forEach(p => {
    activityFeed.push({
      time: p.timestamp ? new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
      type: 'dsa',
      title: `Solved DSA: ${p.title}`,
      meta: p.difficulty,
      color: 'text-amber-400 bg-amber-500/10'
    })
  })

  githubCommits.forEach(c => {
    activityFeed.push({
      time: c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '02:00 PM',
      type: 'github',
      title: `Git Push: ${c.repo}`,
      meta: c.message,
      color: 'text-indigo-400 bg-indigo-500/10'
    })
  })

  if (workoutHabit && workoutHabit.minutes > 0) {
    activityFeed.push({
      time: 'Workout completed',
      type: 'workout',
      title: `Active gym session`,
      meta: `${workoutHabit.minutes}m logged`,
      color: 'text-emerald-400 bg-emerald-500/10'
    })
  }

  if (journalText.trim()) {
    activityFeed.push({
      time: 'Journal note logged',
      type: 'journal',
      title: `Self-reflective entry`,
      meta: todayLogs.journal?.mood || '📝',
      color: 'text-pink-400 bg-pink-500/10'
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Monthly Calendar widget */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1 text-xs font-semibold text-[#9B98AA] uppercase tracking-wider">
          <Calendar size={13} className="text-[#8B5CF6]" />
          <span>Tracker Calendar</span>
        </div>
        <CalendarModule onSelectDay={onSelectDay} />
      </div>

      {/* 2. Today's Activity Feed */}
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-5 shadow-premium">
        <h3 className="font-outfit text-sm font-bold text-[#F5F4F7] mb-4 flex items-center gap-1.5">
          <Activity size={15} className="text-[#8B5CF6]" /> Today's Activity Feed
        </h3>
        <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
          {activityFeed.map((act, idx) => (
            <div key={idx} className="flex gap-3 text-xs">
              <div className={`w-7 h-7 rounded-lg ${act.color} flex items-center justify-center shrink-0 font-bold`}>
                {act.type === 'dsa' ? '💻' : act.type === 'github' ? '🐙' : act.type === 'workout' ? '💪' : '✍️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#F5F4F7] truncate">{act.title}</p>
                <p className="text-[10px] text-[#9B98AA] truncate">{act.meta}</p>
              </div>
              <span className="text-[10px] text-[#9B98AA] font-mono shrink-0 pt-0.5">{act.time}</span>
            </div>
          ))}
          {activityFeed.length === 0 && (
            <div className="text-center py-6 text-xs text-[#9B98AA] italic">
              No logged logs for today. Complete goals to fill the stream!
            </div>
          )}
        </div>
      </div>

      {/* 3. Streak / Badge Card */}
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-5 shadow-premium">
        <h3 className="font-outfit text-sm font-bold text-[#F5F4F7] mb-4 flex items-center gap-1.5">
          <Award size={15} className="text-amber-400" /> Achievements & Badges
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map(badge => {
            const isUnlocked = unlockedBadges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`relative group aspect-square rounded-xl border p-2 flex flex-col items-center justify-center transition-all duration-300 clickable ${
                  isUnlocked 
                    ? 'bg-violet-950/10 border-violet-500/30 scale-100 hover:scale-105 shadow-md shadow-violet-500/5' 
                    : 'bg-[#2A2836]/20 border-[#34313F]/50 opacity-40'
                }`}
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-[9px] text-[#9B98AA] font-bold text-center truncate w-full">{badge.title}</span>

                {/* Hover Details Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-36 hidden group-hover:block z-30 bg-[#1E1C29] border border-[#34313F] text-[10px] text-[#F5F4F7] p-2.5 rounded-lg shadow-xl pointer-events-none">
                  <p className="font-bold text-center text-[#A78BFA]">{badge.title}</p>
                  <p className="text-[9px] text-[#9B98AA] text-center mt-1">{badge.description}</p>
                  <p className="text-[9px] font-bold text-center mt-1.5">
                    {isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
