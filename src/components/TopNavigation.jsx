/**
 * ==========================================
 * COMPONENT: TopNavigation
 * ==========================================
 * The header bar with the logo, search trigger, and main tab navigation.
 */
import { Search, Menu, Command, Sun, Moon, LayoutGrid, Zap, Shield, Disc, Terminal, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './TopNavigation.css';

export const TopNavigation = ({ activeTab, setActiveTab, onOpenSearch, onOpenMobileNav, isUnlockedVault }) => {
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
    return <header className={`top-nav-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
      { /* Left: Mobile menu button + Brand + Nav Links */ }
      <div className="top-nav-left">
        { /* Circular Hamburger */ }
        <button onClick={onOpenMobileNav} aria-label="Open Navigation Menu" className={`top-nav-icon-btn rounded-full brand-hover ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <Menu className="w-5 h-5"/>
        </button>

        { /* Brand/Title Identifier - Clickable to reset to Overview */ }
        <button onClick={()=>setActiveTab('dashboard')} className="top-nav-brand-btn" title="Click to return to Master Overview">
          <div className="top-nav-brand-dot"/>
          <div className="top-nav-brand-text-container">
            <span className={`top-nav-brand-text ${isDark ? 'theme-dark' : 'theme-light'}`}>
              CTRL // CENTER
            </span>
          </div>
        </button>

        { /* Tablet & Desktop Navigation Links */ }
        <nav className="top-nav-links">
          {navItems.map((item)=>{
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        const isOverview = item.id === 'dashboard';
        return <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`top-nav-link-btn ${isOverview ? 'is-overview' : 'not-overview'} ${isActive ? 'active' : 'inactive'} ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <IconComponent className={`top-nav-link-icon ${isActive ? 'active' : 'inactive'}`}/>
                <span>{item.label}</span>
              </button>;
    })}
        </nav>
      </div>

      { /* Right: Search Field, Theme Toggle & Profile Badge */ }
      <div className="top-nav-right">
        { /* Search trigger button */ }
        <button onClick={onOpenSearch} className={`top-nav-search-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <Search className="w-4 h-4 text-[#F25C23]"/>
          <span className="top-nav-search-text">Search...</span>
        </button>

        { /* Theme Toggle Button */ }
        <button onClick={toggleTheme} aria-label="Toggle Dark / Light Theme" title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'} className={`top-nav-icon-btn rounded-lg ${isDark ? 'theme-dark brand-color' : 'theme-light'}`}>
          {isDark ? <Sun className="w-5 h-5 fill-[#F25C23]/20"/> : <Moon className="w-5 h-5"/>}
        </button>

        { /* Profile Circle with Status */ }
        <div className="top-nav-profile-container">
          <div className="top-nav-profile-avatar">
            <span className="top-nav-profile-bg">
              KM
            </span>
          </div>
          { /* Online / Locked status indicator dot */ }
          <span className={`top-nav-profile-status ${isUnlockedVault ? 'unlocked' : 'locked'}`} title={isUnlockedVault ? 'Vault Unlocked' : 'Vault Secure'}/>
        </div>
      </div>
    </header>;
};
