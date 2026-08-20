import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { Flame, Star, Zap } from 'lucide-react'
import { useStore } from '../store'
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'

export default function ActivityCharts() {
  const { dailyData } = useStore()

  // --- Heatmap Logic ---
  // We render the last 4 weeks. Rows = weeks, Columns = days (Mon -> Sun)
  const getHeatmapData = () => {
    const today = new Date('2026-08-20')
    const weeks = []
    
    // Get starting Monday for 4 weeks ago
    const startOfPeriod = startOfWeek(subDays(today, 27), { weekStartsOn: 1 })
    const daysInterval = eachDayOfInterval({ start: startOfPeriod, end: today })
    
    let currentWeek = []
    daysInterval.forEach((d) => {
      const dateStr = format(d, 'yyyy-MM-dd')
      const dayData = dailyData[dateStr] || {}
      
      const dsaCount = dayData.dsaProblems?.length || 0
      const commitCount = dayData.githubCommits?.length || 0
      const workoutMins = dayData.habits?.find(h => h.name === 'workout')?.minutes || 0
      const journalText = dayData.journal?.text || ''

      const totalActivities = dsaCount + commitCount + (workoutMins > 0 ? 1 : 0) + (journalText.trim() ? 1 : 0)
      
      let intensity = 0
      if (totalActivities > 0 && totalActivities <= 2) intensity = 1
      else if (totalActivities > 2 && totalActivities <= 4) intensity = 2
      else if (totalActivities > 4) intensity = 3

      currentWeek.push({
        date: dateStr,
        dayName: format(d, 'eee'),
        total: totalActivities,
        intensity,
        dsa: dsaCount,
        commits: commitCount,
        workout: workoutMins
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', dayName: '', total: 0, intensity: 0, dsa: 0, commits: 0, workout: 0 })
      }
      weeks.push(currentWeek)
    }

    return weeks
  }

  // --- DSA LeetCode Stats ---
  const getDsaStats = () => {
    let easy = 0, medium = 0, hard = 0
    const cumulativeData = []
    
    const sortedDates = Object.keys(dailyData).sort()
    let cumulativeSum = 0

    // Filter only past 10 days for cleaner chart view
    const last10Days = eachDayOfInterval({
      start: subDays(new Date('2026-08-20'), 9),
      end: new Date('2026-08-20')
    })

    // Calculate absolute totals for pie breakdown
    sortedDates.forEach(dateStr => {
      const day = dailyData[dateStr]
      day.dsaProblems?.forEach(p => {
        if (p.difficulty === 'Easy') easy++
        else if (p.difficulty === 'Medium') medium++
        else if (p.difficulty === 'Hard') hard++
      })
    })

    // Generate cumulative progress line
    last10Days.forEach((d) => {
      const dateStr = format(d, 'yyyy-MM-dd')
      const day = dailyData[dateStr]
      const solvedToday = day?.dsaProblems?.length || 0
      cumulativeSum += solvedToday
      cumulativeData.push({
        date: format(d, 'MMM dd'),
        solved: cumulativeSum
      })
    })

    return {
      pieData: [
        { name: 'Easy', value: easy || 1, color: '#10B981' },
        { name: 'Medium', value: medium || 1, color: '#F59E0B' },
        { name: 'Hard', value: hard || 1, color: '#EF4444' }
      ],
      cumulativeData
    }
  }

  // --- GitHub Activity Bar Chart ---
  const getGithubData = () => {
    const data = []
    const last7Days = eachDayOfInterval({
      start: subDays(new Date('2026-08-20'), 6),
      end: new Date('2026-08-20')
    })

    last7Days.forEach(d => {
      const dateStr = format(d, 'yyyy-MM-dd')
      const day = dailyData[dateStr]
      data.push({
        day: format(d, 'EEE'),
        commits: day?.githubCommits?.length || 0
      })
    })

    return data
  }

  // --- Habit Streaks ---
  const getStreaks = () => {
    const sortedDates = Object.keys(dailyData).sort()
    
    let workoutStreak = 0
    let journalStreak = 0
    let dsaStreak = 0

    sortedDates.forEach(dateStr => {
      const day = dailyData[dateStr]
      const dsaCount = day.dsaProblems?.length || 0
      const commitCount = day.githubCommits?.length || 0
      const workoutMins = day.habits?.find(h => h.name === 'workout')?.minutes || 0
      const journalText = day.journal?.text || ''

      if (workoutMins >= 15) workoutStreak++
      else workoutStreak = 0

      if (journalText.trim()) journalStreak++
      else journalStreak = 0

      if (dsaCount > 0) dsaStreak++
      else dsaStreak = 0
    })

    return [
      { name: 'Workouts', streak: workoutStreak, max: 10, color: 'bg-emerald-500' },
      { name: 'Journal', streak: journalStreak, max: 7, color: 'bg-pink-500' },
      { name: 'DSA / LeetCode', streak: dsaStreak, max: 5, color: 'bg-amber-500' }
    ]
  }

  const heatmapWeeks = getHeatmapData()
  const dsaStats = getDsaStats()
  const githubData = getGithubData()
  const streaks = getStreaks()

  return (
    <div className="space-y-6">
      
      {/* 1. Heatmap Card */}
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-[#8B5CF6]" />
          <h3 className="font-outfit text-base font-bold text-[#F5F4F7]">Weekly Engagement</h3>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-[#9B98AA] font-bold">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="space-y-2">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 gap-2">
                {week.map((day, dIdx) => {
                  if (!day.date) return <div key={dIdx} className="aspect-square rounded-lg bg-transparent" />
                  
                  return (
                    <div
                      key={dIdx}
                      className={`relative group aspect-square rounded-lg transition-all duration-300 intensity-${day.intensity} hover:scale-110 border border-[#34313F]/20 clickable`}
                    >
                      {/* Interactive hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-30 bg-[#1E1C29] border border-[#34313F] text-[10px] text-[#F5F4F7] p-2 rounded-lg shadow-xl pointer-events-none">
                        <p className="font-semibold text-center mb-1">{day.date}</p>
                        <p className="flex justify-between"><span>Total:</span> <span>{day.total} logs</span></p>
                        <p className="flex justify-between text-amber-400"><span>DSA:</span> <span>{day.dsa}</span></p>
                        <p className="flex justify-between text-indigo-400"><span>GitHub:</span> <span>{day.commits}</span></p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end items-center gap-2 text-[10px] text-[#9B98AA] pt-2">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-[#2E2B3B]" />
            <span className="w-2.5 h-2.5 rounded bg-[#4C3F72]" />
            <span className="w-2.5 h-2.5 rounded bg-[#7C5CFC]" />
            <span className="w-2.5 h-2.5 rounded bg-[#A78BFA]" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LeetCode Cumulative Progress Area Chart */}
        <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <div>
            <h4 className="font-outfit text-sm font-bold text-[#F5F4F7] mb-4">DSA Progress (Last 10 Days)</h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dsaStats.cumulativeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#34313F" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#9B98AA" fontSize={9} />
                  <YAxis stroke="#9B98AA" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: '#211F2C', borderColor: '#34313F', color: '#F5F4F7', fontSize: 11 }} />
                  <Area type="monotone" dataKey="solved" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorSolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Difficulty breakdown pie chart */}
          <div className="flex items-center gap-4 border-t border-[#34313F]/40 pt-4 mt-4">
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dsaStats.pieData}
                    innerRadius={18}
                    outerRadius={28}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dsaStats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-2 text-[10px]">
              {dsaStats.pieData.map(item => (
                <div key={item.name} className="flex flex-col">
                  <span className="text-[#9B98AA] font-semibold">{item.name}</span>
                  <span className="text-[#F5F4F7] font-bold font-mono">{item.value === 1 && !Object.keys(dailyData).length ? 0 : item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Commits Bar Chart */}
        <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
          <h4 className="font-outfit text-sm font-bold text-[#F5F4F7] mb-4 font-sans">GitHub Commits (Past week)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={githubData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#34313F" opacity={0.3} />
                <XAxis dataKey="day" stroke="#9B98AA" fontSize={10} />
                <YAxis stroke="#9B98AA" fontSize={10} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#211F2C', borderColor: '#34313F', color: '#F5F4F7', fontSize: 11 }} />
                <Bar dataKey="commits" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Habit Streaks Card */}
      <div className="bg-[#211F2C] border border-[#34313F] rounded-2xl p-6 shadow-premium">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-500 fill-orange-500" size={18} />
          <h3 className="font-outfit text-base font-bold text-[#F5F4F7]">Habit Streaks</h3>
        </div>

        <div className="space-y-4">
          {streaks.map(streak => (
            <div key={streak.name} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#F5F4F7] font-semibold flex items-center gap-1">
                  {streak.name}
                  {streak.streak > 0 && <span className="text-orange-500 font-bold">🔥 {streak.streak}d</span>}
                </span>
                <span className="text-[#9B98AA] font-mono">Streak count: {streak.streak}</span>
              </div>
              {/* Progress Bar Representation */}
              <div className="w-full bg-[#2E2B3B] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${streak.color}`}
                  style={{ width: `${Math.min(100, (streak.streak / streak.max) * 100) || 5}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
