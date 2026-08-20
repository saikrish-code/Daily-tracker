import React from 'react'
import { LayoutDashboard, Code, Dumbbell, BookOpen, Calendar, Settings, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
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
            <span className="text-white text-base font-black">P</span>
          </div>
          <span className="font-outfit text-lg font-extrabold text-[#F5F4F7] tracking-wide">PulseTrack</span>
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

      {/* Pinned Upgrade CTA */}
      <div className="bg-gradient-to-br from-[#2A2836] to-[#1E1C29] border border-[#34313F] rounded-2xl p-4.5 text-center relative overflow-hidden shadow-premium">
        {/* Absolute glow design elements */}
        <div className="absolute -top-12 -right-12 w-20 h-20 bg-violet-500/20 rounded-full blur-xl pointer-events-none" />
        
        <Sparkles size={20} className="text-[#A78BFA] mx-auto mb-2.5 animate-pulse" />
        <h4 className="font-outfit text-xs font-bold text-[#F5F4F7]">Get Advanced Insights</h4>
        <p className="text-[10px] text-[#9B98AA] mt-1 mb-3.5 px-1 leading-relaxed">Unlock detailed cloud database synching & team reporting boards.</p>
        <button className="w-full py-2 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] hover:brightness-110 text-white text-[11px] font-bold rounded-xl transition-all shadow-md shadow-violet-500/10 clickable">
          Upgrade to Plus
        </button>
      </div>
    </div>
  )
}
