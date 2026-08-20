import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Star, Calendar as CalendarIcon, Award, MessageSquareCode, Bell, User, Zap } from 'lucide-react'
import { useStore, BADGES } from './store'
import Sidebar from './components/Sidebar'
import RightRail from './components/RightRail'
import CountdownProgress from './components/CountdownProgress'
import ActivityCharts from './components/ActivityCharts'
import CustomCursor from './components/CustomCursor'
import GoalModal from './components/GoalModal'
import DayDetailModal from './components/DayDetailModal'
import { DsaScreen, GithubScreen, HabitsScreen, JournalScreen, SettingsScreen } from './components/Screens'
import { format } from 'date-fns'

export default function App() {
  const { 
    dailyData, 
    seedDataIfNeeded, 
    lastSeenDate, 
    setLastSeenDate, 
    badgeNotifications, 
    clearBadgeNotifications 
  } = useStore()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Date setup
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  
  // Goal setting modal trigger
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  
  // Day detail modal trigger
  const [selectedDate, setSelectedDate] = useState('')
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false)

  // Seed data and show Goal Modal on first daily load
  useEffect(() => {
    seedDataIfNeeded()
    
    if (lastSeenDate !== todayStr) {
      setIsGoalModalOpen(true)
      setLastSeenDate(todayStr)
    }
  }, [lastSeenDate, todayStr, seedDataIfNeeded, setLastSeenDate])

  const handleOpenDayDetail = (dateStr) => {
    setSelectedDate(dateStr)
    setIsDayDetailOpen(true)
  }

  // Mobile Bottom Navigation Bar mapper
  const mobileMenuItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'dsa', label: 'DSA', icon: '💻' },
    { id: 'github', label: 'Git', icon: '🐙' },
    { id: 'habits', label: 'Habits', icon: '💪' },
    { id: 'journal', label: 'Note', icon: '✍️' },
  ]

  // Main layout router
  const renderCenterContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-[#9B98AA] uppercase tracking-wider">Welcome Back</span>
                <h2 className="font-outfit text-2xl font-black text-[#F5F4F7] mt-0.5">Your Productivity Pulse</h2>
              </div>
              <div className="flex items-center gap-2 bg-[#211F2C] border border-[#34313F]/50 px-3 py-1.5 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-[#F5F4F7] font-mono">{todayStr}</span>
              </div>
            </div>

            {/* Countdown / Progress Ring */}
            <CountdownProgress onEditGoals={() => setIsGoalModalOpen(true)} date={todayStr} />

            {/* Graphs & Charts */}
            <ActivityCharts />
          </div>
        )
      case 'dsa':
        return <DsaScreen date={todayStr} />
      case 'github':
        return <GithubScreen date={todayStr} />
      case 'habits':
        return <HabitsScreen date={todayStr} />
      case 'journal':
        return <JournalScreen date={todayStr} />
      case 'calendar':
        return (
          <div className="space-y-4">
            <h2 className="font-outfit text-xl font-bold text-[#F5F4F7]">Month Activity Map</h2>
            <div className="max-w-md mx-auto">
              <RightRail date={todayStr} onSelectDay={handleOpenDayDetail} />
            </div>
          </div>
        )
      case 'settings':
        return <SettingsScreen />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1C29] flex flex-col md:flex-row relative text-[#F5F4F7]">
      {/* Custom Spring Cursor */}
      <CustomCursor />

      {/* Confetti & Toast Badge notification overlay */}
      <AnimatePresence>
        {badgeNotifications.length > 0 && (
          <div className="fixed top-5 right-5 z-[100] space-y-3">
            {badgeNotifications.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="bg-[#211F2C] border-2 border-violet-500 rounded-2xl p-4 shadow-premium-lg flex items-center gap-4.5 max-w-sm relative overflow-hidden"
              >
                {/* Simulated Confetti Sparks */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-violet-400"
                      initial={{ x: '50%', y: '50%', scale: 0 }}
                      animate={{
                        x: ['50%', `${Math.random() * 100}%`],
                        y: ['50%', `${Math.random() * 100}%`],
                        scale: [0, 1, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>

                <div className="text-3xl bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider">Achievement Unlocked!</span>
                  </div>
                  <h4 className="font-outfit text-sm font-bold text-[#F5F4F7]">{badge.title}</h4>
                  <p className="text-[11px] text-[#9B98AA] mt-0.5">{badge.description}</p>
                </div>
                <button 
                  onClick={clearBadgeNotifications}
                  className="absolute top-2 right-2 text-[#9B98AA] hover:text-[#F5F4F7]"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#211F2C] border-b border-[#34313F] px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-outfit text-base font-extrabold text-[#F5F4F7]">Rise</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-[#2A2836] rounded-lg text-[#9B98AA] hover:text-[#F5F4F7] transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-0 w-full bg-[#211F2C] border-b border-[#34313F] p-4 flex flex-col gap-2 z-30 md:hidden"
          >
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              🏠 Dashboard Home
            </button>
            <button
              onClick={() => { setActiveTab('dsa'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              💻 DSA Practice Tracker
            </button>
            <button
              onClick={() => { setActiveTab('github'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              🐙 GitHub Activities
            </button>
            <button
              onClick={() => { setActiveTab('habits'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              💪 Workouts & Habits
            </button>
            <button
              onClick={() => { setActiveTab('journal'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              ✍️ Reflection Journal
            </button>
            <button
              onClick={() => { setActiveTab('calendar'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              📅 Month Map Calendar
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
              className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#F5F4F7] hover:bg-[#2A2836]"
            >
              ⚙️ Settings Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-x-hidden">
        
        {/* Scrollable Center screen */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-56px)] md:max-h-screen">
          {renderCenterContent()}
        </main>

        {/* Right Rail Panel (hidden in other tabs except dashboard, calendar on tablet/mobile screens) */}
        {activeTab === 'dashboard' && (
          <aside className="w-full lg:w-80 p-4 md:p-6 lg:p-8 bg-[#1E1C29] border-t lg:border-t-0 lg:border-l border-[#34313F] overflow-y-auto max-h-screen">
            <RightRail date={todayStr} onSelectDay={handleOpenDayDetail} />
          </aside>
        )}
      </div>

      {/* Mobile Bottom Navigation Chips */}
      <div className="md:hidden bg-[#211F2C] border-t border-[#34313F] py-2 px-4 flex items-center justify-around sticky bottom-0 z-40">
        {mobileMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === item.id ? 'bg-[#8B5CF6]/15 text-[#A78BFA]' : 'text-[#9B98AA]'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Goal Setting Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        date={todayStr}
      />

      {/* Day Logs Detail Modal (3D fall & bounce animation modal) */}
      <DayDetailModal
        isOpen={isDayDetailOpen}
        onClose={() => setIsDayDetailOpen(false)}
        date={selectedDate}
        dayData={dailyData[selectedDate] || {}}
      />
    </div>
  )
}
