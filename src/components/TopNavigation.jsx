/**
 * ==========================================
 * COMPONENT: TopNavigation
 * ==========================================
 * The header bar with the logo, search trigger, and main tab navigation.
 */
import { Search, Menu, Command, Sun, Moon, LayoutGrid, Zap, Shield, Disc, Terminal, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const TopNavigation = ({ activeTab, setActiveTab, onOpenSearch, onOpenMobileNav, isUnlockedVault })=>{
    const { isDark, toggleTheme } = useTheme();
    const navItems = [
        {
            id: 'dashboard',
            label: 'OVERVIEW',
            icon: LayoutGrid
        },
        {
            id: 'launchpad',
            label: 'LAUNCHPAD',
            icon: Zap
        },
        {
            id: 'vault',
            label: 'VAULT DOCS',
            icon: Shield
        },
        {
            id: 'playlists',
            label: 'LO-FI & BEATS',
            icon: Disc
        },
        {
            id: 'tools',
            label: 'DEV TOOLS',
            icon: Terminal
        },
        {
            id: 'scratchpad',
            label: 'SCRATCHPAD',
            icon: Edit3
        }
    ];
    return <header className={`w-full border-b-3 px-4 sm:px-6 py-3 flex items-center justify-between relative z-20 transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white' : 'bg-[#FFFFFF] border-[#171717] text-[#171717]'}`}>
      { /* Left: Mobile menu button + Brand + Nav Links */ }
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        { /* Circular Hamburger */ }
        <button onClick={onOpenMobileNav} aria-label="Open Navigation Menu" className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${isDark ? 'border-[#3F3F46] bg-[#27272A] hover:bg-[#F25C23] hover:text-white text-stone-200 shadow-editorial-sm-dark' : 'border-[#171717] bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white text-[#171717] shadow-editorial-sm'}`}>
          <Menu className="w-5 h-5"/>
        </button>

        { /* Brand/Title Identifier - Clickable to reset to Overview */ }
        <button onClick={()=>setActiveTab('dashboard')} className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none flex-shrink-0" title="Click to return to Master Overview">
          <div className="w-3.5 h-3.5 rounded-full bg-[#F25C23] group-hover:scale-125 transition-transform animate-pulse flex-shrink-0"/>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className={`font-heading text-base sm:text-lg md:text-xl font-extrabold tracking-wider group-hover:text-[#F25C23] transition-colors whitespace-nowrap ${isDark ? 'text-white' : 'text-[#171717]'}`}>
              CTRL // CENTER
            </span>
            
          </div>
        </button>

        { /* Tablet & Desktop Navigation Links */ }
        <nav className="hidden md:flex items-center gap-1 xl:gap-2 ml-1 py-1">
          {navItems.map((item)=>{
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        const isOverview = item.id === 'dashboard';
        return <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`font-heading text-xs px-2.5 xl:px-3 py-1.5 rounded-md border-2 transition-all cursor-pointer items-center gap-1.5 whitespace-nowrap ${isOverview ? 'flex' : 'hidden xl:flex'} ${isActive ? 'bg-[#F25C23] text-white border-[#F25C23] font-bold shadow-editorial-sm' : isDark ? 'bg-transparent text-stone-300 border-transparent hover:border-[#3F3F46] hover:bg-[#27272A]' : 'bg-transparent text-[#171717] border-transparent hover:border-[#171717] hover:bg-[#E8E8E5]'}`}>
                <IconComponent className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#F25C23]'}`}/>
                <span>{item.label}</span>
              </button>;
    })}
        </nav>
      </div>

      { /* Right: Search Field, Theme Toggle & Profile Badge */ }
      <div className="flex items-center gap-2 sm:gap-3">
        { /* Search trigger button */ }
        <button onClick={onOpenSearch} className={`flex items-center gap-2 border-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${isDark ? 'bg-[#27272A] hover:bg-[#3F3F46] border-[#3F3F46] text-stone-200 shadow-editorial-sm-dark' : 'bg-[#F5F5F3] hover:bg-[#E8E8E5] border-[#171717] text-[#171717] shadow-editorial-sm'}`}>
          <Search className="w-4 h-4 text-[#F25C23]"/>
          <span className="hidden sm:inline font-sans text-xs font-semibold">Search...</span>
        </button>

        { /* Theme Toggle Button */ }
        <button onClick={toggleTheme} aria-label="Toggle Dark / Light Theme" title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'} className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${isDark ? 'bg-[#27272A] hover:bg-[#3F3F46] border-[#3F3F46] text-[#F25C23] shadow-editorial-sm-dark' : 'bg-[#F5F5F3] hover:bg-[#E8E8E5] border-[#171717] text-[#171717] shadow-editorial-sm'}`}>
          {isDark ? <Sun className="w-5 h-5 fill-[#F25C23]/20"/> : <Moon className="w-5 h-5"/>}
        </button>

        { /* Profile Circle with Status */ }
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-full border-2 border-[#171717] bg-[#171717] text-white flex items-center justify-center font-heading font-bold text-sm shadow-editorial-sm group-hover:border-[#F25C23] transition-colors overflow-hidden">
            <span className="bg-gradient-to-tr from-[#F25C23] to-[#FF5A1F] w-full h-full flex items-center justify-center">
              KM
            </span>
          </div>
          { /* Online / Locked status indicator dot */ }
          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${isUnlockedVault ? 'bg-emerald-500' : 'bg-[#F25C23]'}`} title={isUnlockedVault ? 'Vault Unlocked' : 'Vault Secure'}/>
        </div>
      </div>
    </header>;
};
