import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { subDays, format } from 'date-fns'

// List of available badges
export const BADGES = [
  { id: 'first_goal', title: 'First Victory', description: 'Complete today\'s first goal', icon: '🏆', category: 'general' },
  { id: 'streak_3', title: 'Triathlon', description: 'Maintain a 3-day workout streak', icon: '🔥', category: 'habits' },
  { id: 'streak_7', title: 'Unstoppable', description: 'Maintain a 7-day activity streak', icon: '⚡', category: 'general' },
  { id: 'dsa_10', title: 'Algo Master', description: 'Solve 10 LeetCode problems', icon: '💻', category: 'dsa' },
  { id: 'github_15', title: 'Green Wall', description: 'Push 15 commits or PRs', icon: '🐙', category: 'github' },
  { id: 'journal_5', title: 'Self-Reflective', description: 'Write 5 journal entries', icon: '✍️', category: 'journal' },
]

// Generate sample mock data disabled as per user request to start clean
const generateMockData = () => {
  return {}
}


export const useStore = create(
  persist(
    (set, get) => ({
      dailyData: {},
      unlockedBadges: [],
      badgeNotifications: [],

      defaultGoals: [
        { id: '1', type: 'dsa', label: 'Solve DSA problems', target: 2, done: 0 },
        { id: '2', type: 'github', label: 'GitHub commits / PRs', target: 3, done: 0 },
        { id: '3', type: 'workout', label: 'Workout minutes', target: 30, done: 0 },
        { id: '4', type: 'journal', label: 'Write daily journal', target: 1, done: 0 }
      ],

      lastSeenDate: '',

      seedDataIfNeeded: () => {
        const state = get()
        const keys = Object.keys(state.dailyData)
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        
        // If there's old seeded mock data, wipe the database clean for fresh start.
        const hasPastMockData = keys.some(k => k !== todayStr)
        if (hasPastMockData) {
          set({ dailyData: {}, unlockedBadges: [], badgeNotifications: [] })
        }
      },

      setGoalsForDate: (date, goals) => {
        set((state) => {
          const dayData = state.dailyData[date] || { dsaProblems: [], githubCommits: [], habits: [{ name: 'workout', minutes: 0, target: 30 }], journal: { mood: '', text: '' } }
          
          const updatedGoals = goals.map(g => {
            let currentDone = 0
            if (g.type === 'dsa') currentDone = dayData.dsaProblems?.length || 0
            else if (g.type === 'github') currentDone = dayData.githubCommits?.length || 0
            else if (g.type === 'workout') currentDone = dayData.habits?.find(h => h.name === 'workout')?.minutes || 0
            else if (g.type === 'journal') currentDone = dayData.journal?.text ? 1 : 0
            else currentDone = g.done || 0

            return { ...g, done: currentDone }
          })

          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...dayData,
                goals: updatedGoals
              }
            }
          }
        })
        get().checkAndUnlockBadges()
      },

      updateGoalProgress: (date, goalId, doneValue) => {
        set((state) => {
          const dayData = state.dailyData[date]
          if (!dayData || !dayData.goals) return {}
          const updatedGoals = dayData.goals.map(g => 
            g.id === goalId ? { ...g, done: doneValue } : g
          )
          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...dayData,
                goals: updatedGoals
              }
            }
          }
        })
        get().checkAndUnlockBadges()
      },

      addDsaProblem: (date, title, difficulty, url) => {
        set((state) => {
          const dayData = state.dailyData[date] || { goals: [], dsaProblems: [], githubCommits: [], habits: [{ name: 'workout', minutes: 0, target: 30 }], journal: { mood: '', text: '' } }
          const newDsaList = [...(dayData.dsaProblems || []), { title, difficulty, url, timestamp: new Date().toISOString() }]
          
          const updatedGoals = (dayData.goals || []).map(g => 
            g.type === 'dsa' ? { ...g, done: newDsaList.length } : g
          )

          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...dayData,
                dsaProblems: newDsaList,
                goals: updatedGoals
              }
            }
          }
        })
        get().checkAndUnlockBadges()
      },

      addGithubCommit: (date, repo, message, url) => {
        set((state) => {
          const dayData = state.dailyData[date] || { goals: [], dsaProblems: [], githubCommits: [], habits: [{ name: 'workout', minutes: 0, target: 30 }], journal: { mood: '', text: '' } }
          const newCommits = [...(dayData.githubCommits || []), { repo, message, url, timestamp: new Date().toISOString() }]
          
          const updatedGoals = (dayData.goals || []).map(g => 
            g.type === 'github' ? { ...g, done: newCommits.length } : g
          )

          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...dayData,
                githubCommits: newCommits,
                goals: updatedGoals
              }
            }
          }
        })
        get().checkAndUnlockBadges()
      },

      updateWorkoutMinutes: (date, minutes) => {
        set((state) => {
          const dayData = state.dailyData[date] || { goals: [], dsaProblems: [], githubCommits: [], habits: [{ name: 'workout', minutes: 0, target: 30 }], journal: { mood: '', text: '' } }
          const habits = dayData.habits || []
          const workoutHabit = habits.find(h => h.name === 'workout') || { name: 'workout', minutes: 0, target: 30 }
          
          const updatedWorkout = { ...workoutHabit, minutes }
          const newHabits = [updatedWorkout, ...habits.filter(h => h.name !== 'workout')]

          const updatedGoals = (dayData.goals || []).map(g => 
            g.type === 'workout' ? { ...g, done: minutes } : g
          )

          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...dayData,
                habits: newHabits,
                goals: updatedGoals
              }
            }
          }
        })
        get().checkAndUnlockBadges()
      },

      updateJournal: (date, text, mood) => {
        set((state) => {
          const dayData = state.dailyData[date] || { goals: [], dsaProblems: [], githubCommits: [], habits: [{ name: 'workout', minutes: 0, target: 30 }], journal: { mood: '', text: '' } }
          const newJournal = { text, mood }

          const updatedGoals = (dayData.goals || []).map(g => 
            g.type === 'journal' ? { ...g, done: text.trim() ? 1 : 0 } : g
          )

          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...dayData,
                journal: newJournal,
                goals: updatedGoals
              }
            }
          }
        })
        get().checkAndUnlockBadges()
      },

      setLastSeenDate: (date) => {
        set({ lastSeenDate: date })
      },

      clearBadgeNotifications: () => {
        set({ badgeNotifications: [] })
      },

      checkAndUnlockBadges: () => {
        const state = get()
        const newlyUnlocked = []
        const currentUnlocked = [...state.unlockedBadges]

        let totalDsa = 0
        let totalCommits = 0
        let journalCount = 0
        
        const sortedDates = Object.keys(state.dailyData).sort()
        
        let maxWorkoutStreak = 0
        let currentWorkoutStreak = 0
        
        let maxActivityStreak = 0
        let currentActivityStreak = 0

        sortedDates.forEach((dStr) => {
          const day = state.dailyData[dStr]
          const dsaCount = day.dsaProblems?.length || 0
          const commitCount = day.githubCommits?.length || 0
          const workoutMins = day.habits?.find(h => h.name === 'workout')?.minutes || 0
          const journalText = day.journal?.text || ''

          totalDsa += dsaCount
          totalCommits += commitCount
          if (journalText.trim()) journalCount++

          const hasActivity = dsaCount > 0 || commitCount > 0 || workoutMins > 0 || journalText.trim().length > 0
          if (hasActivity) {
            currentActivityStreak++
            if (currentActivityStreak > maxActivityStreak) maxActivityStreak = currentActivityStreak
          } else {
            currentActivityStreak = 0
          }

          if (workoutMins >= 15) {
            currentWorkoutStreak++
            if (currentWorkoutStreak > maxWorkoutStreak) maxWorkoutStreak = currentWorkoutStreak
          } else {
            currentWorkoutStreak = 0
          }
        })

        let firstVictoryMet = false
        for (const date in state.dailyData) {
          const day = state.dailyData[date]
          if (day.goals && day.goals.length > 0 && day.goals.some(g => g.done >= g.target)) {
            firstVictoryMet = true
            break
          }
        }

        const checkBadge = (id) => {
          if (currentUnlocked.includes(id)) return

          let unlock = false
          if (id === 'first_goal' && firstVictoryMet) unlock = true
          else if (id === 'streak_3' && maxWorkoutStreak >= 3) unlock = true
          else if (id === 'streak_7' && maxActivityStreak >= 7) unlock = true
          else if (id === 'dsa_10' && totalDsa >= 10) unlock = true
          else if (id === 'github_15' && totalCommits >= 15) unlock = true
          else if (id === 'journal_5' && journalCount >= 5) unlock = true

          if (unlock) {
            newlyUnlocked.push(id)
            currentUnlocked.push(id)
          }
        }

        BADGES.forEach(badge => checkBadge(badge.id))

        if (newlyUnlocked.length > 0) {
          const notifications = newlyUnlocked.map(id => BADGES.find(b => b.id === id))
          set({
            unlockedBadges: currentUnlocked,
            badgeNotifications: [...state.badgeNotifications, ...notifications]
          })
        }
      }
    }),
    {
      name: 'pulsetrack-storage',
    }
  )
)
