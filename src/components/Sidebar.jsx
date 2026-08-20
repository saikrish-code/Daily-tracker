import React from 'react'
import { LayoutDashboard, Code, Dumbbell, BookOpen, Calendar, Settings, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import Github from './GithubIcon'

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Tracker', icon: Code },
    { id: 'github', label: 'GitHub', icon: Github },
    { id: 'habits', label: 'Habits', icon: Dumbbell },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-[#211F2C] border-r border-[#34313F] h-full flex flex-col justify-between p-5 relative">
      <div>
        {/* App Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="font-outfit text-lg font-extrabold text-[#F5F4F7] tracking-wide">Rise</span>
        </div>

        {/* Menu Navigation items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 clickable ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-transparent border-l-4 border-[#8B5CF6] text-[#F5F4F7] font-semibold' 
                    : 'text-[#9B98AA] hover:text-[#F5F4F7] hover:bg-[#2A2836]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#A78BFA]' : 'text-[#9B98AA]'} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

    </div>
  )
}
