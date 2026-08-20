import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns'
import { useStore } from '../store'

export default function CalendarModule({ onSelectDay }) {
  const { dailyData } = useStore()
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-08-20')) // Centered around local date

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Determine calendar boundary grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Find if date has any logged activities
  const getActivitiesForDate = (dateStr) => {
    const day = dailyData[dateStr]
    if (!day) return []
    const acts = []
    
    // DSA
    if (day.dsaProblems && day.dsaProblems.length > 0) acts.push('dsa')
    // GitHub
    if (day.githubCommits && day.githubCommits.length > 0) acts.push('github')
    // Workout
    if (day.habits && day.habits.some(h => h.name === 'workout' && h.minutes > 0)) acts.push('workout')
    // Journal
    if (day.journal && day.journal.text && day.journal.text.trim()) acts.push('journal')

    return acts
  }

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-5 shadow-premium">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-outfit text-sm font-bold text-[#F5F4F7]">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-[#2A2836] border border-[#34313F]/50 rounded-lg text-[#9B98AA] hover:text-[#F5F4F7] transition-all clickable"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-[#2A2836] border border-[#34313F]/50 rounded-lg text-[#9B98AA] hover:text-[#F5F4F7] transition-all clickable"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Week Day Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekdays.map((day, idx) => (
          <span key={idx} className="text-[10px] font-semibold text-[#9B98AA] uppercase">
            {day}
          </span>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isDayToday = isToday(day)
          const activities = getActivitiesForDate(dateStr)

          return (
            <button
              key={idx}
              onClick={() => onSelectDay(dateStr)}
              disabled={!isCurrentMonth}
              className={`relative flex flex-col items-center justify-center aspect-square rounded-xl border text-xs font-semibold transition-all ${
                !isCurrentMonth 
                  ? 'border-transparent text-[#9B98AA]/20 pointer-events-none'
                  : isDayToday
                    ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-md shadow-violet-500/20'
                    : 'bg-[#2A2836]/30 border-[#34313F]/30 hover:border-[#8B5CF6]/50 text-[#F5F4F7] hover:bg-[#2A2836]'
              } clickable`}
            >
              <span>{format(day, 'd')}</span>

              {/* Category-Colored Activity Dots */}
              {activities.length > 0 && isCurrentMonth && (
                <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
                  {activities.map((act) => (
                    <span
                      key={act}
                      className={`w-1 h-1 rounded-full ${
                        act === 'dsa' ? 'bg-amber-400' :
                        act === 'github' ? 'bg-indigo-400' :
                        act === 'workout' ? 'bg-emerald-400' :
                        'bg-pink-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
