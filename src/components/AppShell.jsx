import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { TopNavigation } from "./TopNavigation";
import { QuickLaunch } from "./QuickLaunch";
import { PrivateVault } from "./PrivateVault";
import { PlaylistPanel } from "./PlaylistPanel";
import { ToolsWorkspace } from "./ToolsWorkspace";
import { QuickScratchpad } from "./QuickScratchpad";
import { ShortcutBar } from "./ShortcutBar";
import { OverlappingPlusButton } from "./OverlappingPlusButton";
import { MobileNavigation } from "./MobileNavigation";
import { useTheme } from "../context/ThemeContext";
import { AddLinkModal } from "./modals/AddLinkModal";
import { VaultModal } from "./modals/VaultModal";
import { SearchModal } from "./modals/SearchModal";
import { ShortcutsModal } from "./modals/ShortcutsModal";
import { QuickActionMenu } from "./modals/QuickActionMenu";
import { AddPlaylistModal } from "./modals/AddPlaylistModal";
import { AddToolModal } from "./modals/AddToolModal";
import {
  INITIAL_LINKS,
  INITIAL_PLAYLISTS,
  INITIAL_TOOLS,
  INITIAL_RECENTS,
  INITIAL_VAULT_DOCS,
} from "../data/defaultData";
/**
 * ==========================================
 * MASTER LAYOUT COMPONENT: AppShell
 * ==========================================
 * This component is the "brain" and the layout container for the entire dashboard.
 * It holds the global state (like which tab is active, the list of links, tools, etc.)
 * and renders the Bento Grid layout structure.
 */
export const AppShell = () => {
  const { isDark } = useTheme();
  // Navigation & View State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  // Data States (Code Driven)
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [playlists, setPlaylists] = useState(INITIAL_PLAYLISTS);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [recents, setRecents] = useState(INITIAL_RECENTS);
  const [isUnlockedVault, setIsUnlockedVault] = useState(false);
  const [vaultDocs, setVaultDocs] = useState(INITIAL_VAULT_DOCS);

  // Auto-sync during development hot reloads if you edit defaultData.jsx
  useEffect(() => {
    setLinks(INITIAL_LINKS);
    setPlaylists(INITIAL_PLAYLISTS);
    setTools(INITIAL_TOOLS);
    setRecents(INITIAL_RECENTS);
    setVaultDocs(INITIAL_VAULT_DOCS);
  }, [
    INITIAL_LINKS,
    INITIAL_PLAYLISTS,
    INITIAL_TOOLS,
    INITIAL_RECENTS,
    INITIAL_VAULT_DOCS,
  ]);
  // Modals Visibility State
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  // LocalStorage persistence REMOVED: Everything is now completely code-driven
  const handleAddVaultDocument = (newDoc) => {
    setVaultDocs((prev) => [newDoc, ...prev]);
  };
  // Robust helper to open URLs without popup-blocker issues
  const openExternalUrl = (rawUrl) => {
    if (!rawUrl) return;
    const url =
      rawUrl.startsWith("http://") ||
      rawUrl.startsWith("https://") ||
      rawUrl.startsWith("mailto:") ||
      rawUrl.startsWith("tel:")
        ? rawUrl
        : `https://${rawUrl}`;
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, "_blank");
    }
  };
  /**
   * ==========================================
   * GLOBAL KEYBOARD SHORTCUTS
   * ==========================================
   * This effect listens for key presses across the entire app
   * to trigger features like the Search Modal (Cmd+K) or jumping to apps.
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          activeElement.isContentEditable);
      // Escape key closes open modals or menus
      if (e.key === "Escape") {
        setIsAddLinkOpen(false);
        setIsVaultModalOpen(false);
        setIsSearchOpen(false);
        setIsShortcutsOpen(false);
        setIsQuickActionOpen(false);
        setIsAddPlaylistOpen(false);
        setIsAddToolOpen(false);
        setIsMobileNavOpen(false);
        return;
      }
      // If user is currently typing in an input field, do not trigger single-key or command shortcuts (unless ESC handled above)
      if (isInputActive) {
        return;
      }
      // 1. Command + K or Ctrl + K or '/' for Search
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        e.key === "/"
      ) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      // 2. '?' or 'h' for Shortcuts Cheat Sheet
      if (
        e.key === "?" ||
        (e.key.toLowerCase() === "h" && !e.metaKey && !e.ctrlKey && !e.altKey)
      ) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }
      // 3. 'v' or ⌘V to toggle Private Vault
      if (e.key.toLowerCase() === "v" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsVaultModalOpen((prev) => !prev);
        return;
      }
      // 4. 'n' for Quick Add Link modal
      if (
        e.key.toLowerCase() === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setEditingLink(null);
        setIsAddLinkOpen(true);
        return;
      }
      // 5. 'q' for Quick Action Launcher menu
      if (
        e.key.toLowerCase() === "q" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsQuickActionOpen((prev) => !prev);
        return;
      }
      // 6. Navigation View hotkeys:
      // g + o -> Overview ('0')
      // 'w' -> Dev Tools ('tools')
      // 'p' -> Playlists ('playlists')
      // 's' -> Scratchpad ('scratchpad')
      // '0' -> Overview ('dashboard')
      if (e.key === "0") {
        e.preventDefault();
        setActiveTab("dashboard");
        return;
      }
      // Single-letter direct actions (when not modifier-bound)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const lowerKey = e.key.toLowerCase();
        if (lowerKey === "t") {
          // Toggle Tools / Dev Tools tab
          e.preventDefault();
          setActiveTab((prev) => (prev === "tools" ? "dashboard" : "tools"));
          return;
        }
        if (lowerKey === "m") {
          // Toggle Lo-Fi Beats / Music tab
          e.preventDefault();
          setActiveTab((prev) =>
            prev === "playlists" ? "dashboard" : "playlists",
          );
          return;
        }
      }
      // 7. Quick Launch Hotkeys for Launch Links
      // Supports:
      // - Direct character match from link.shortcutKey (e.g. '1', '2', 'P', 'Y', 'L', 'G', 'W', 'F', 'S', 'C')
      // - ⌘1..⌘9 / Ctrl+1..9 or number keys 1..9 matching tile index
      const keyChar = e.key;
      const upperKeyChar = e.key.toUpperCase();
      // Check if shortcutKey matches explicitly on any link
      const directKeyMatch = links.find(
        (l) => l.shortcutKey && l.shortcutKey.toUpperCase() === upperKeyChar,
      );
      if (directKeyMatch) {
        e.preventDefault();
        handleOpenLink(directKeyMatch);
        return;
      }
      // Check numeric index shortcuts (1-9, Digit1-Digit9, Numpad1-Numpad9)
      let matchedNumber = null;
      if (/^[1-9]$/.test(keyChar)) {
        matchedNumber = keyChar;
      } else if (e.code && /^Digit[1-9]$/.test(e.code)) {
        matchedNumber = e.code.replace("Digit", "");
      } else if (e.code && /^Numpad[1-9]$/.test(e.code)) {
        matchedNumber = e.code.replace("Numpad", "");
      }
      if (matchedNumber) {
        const index = parseInt(matchedNumber, 10) - 1;
        const matched = links[index];
        if (matched) {
          e.preventDefault();
          handleOpenLink(matched);
          return;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [links]);
  // Handler for opening links & logging to Recently Opened
  const handleOpenLink = (link) => {
    // Log to recents
    const newRecent = {
      id: Date.now().toString(),
      title: `${link.name} launched`,
      type: "link",
      timestamp: "Just now",
      url: link.url,
      category: link.category,
    };
    setRecents((prev) => [
      newRecent,
      ...prev.filter((r) => r.id !== newRecent.id),
    ]);
    // Update click count
    setLinks((prev) =>
      prev.map((l) =>
        l.id === link.id
          ? {
              ...l,
              clickCount: (l.clickCount || 0) + 1,
            }
          : l,
      ),
    );
    // Open target window safely
    openExternalUrl(link.url);
  };
  const handleOpenPlaylist = (playlist) => {
    const newRecent = {
      id: Date.now().toString(),
      title: `Playlist: ${playlist.title}`,
      type: "playlist",
      timestamp: "Just now",
      url: playlist.url,
      category: playlist.category,
    };
    setRecents((prev) => [newRecent, ...prev]);
    openExternalUrl(playlist.url);
  };
  const handleOpenTool = (tool) => {
    const newRecent = {
      id: Date.now().toString(),
      title: `Tool: ${tool.name}`,
      type: "tool",
      timestamp: "Just now",
      url: tool.url,
    };
    setRecents((prev) => [newRecent, ...prev]);
    if (tool.urls && tool.urls.length > 0) {
      tool.urls.forEach((tabUrl) => {
        openExternalUrl(tabUrl);
      });
    } else {
      openExternalUrl(tool.url);
    }
  };
  const handleSaveLink = (linkData) => {
    if (editingLink) {
      setLinks((prev) =>
        prev.map((l) =>
          l.id === editingLink.id
            ? {
                ...l,
                ...linkData,
              }
            : l,
        ),
      );
      setEditingLink(null);
    } else {
      const newLink = {
        id: linkData.id || Date.now().toString(),
        name: linkData.name || "New App",
        url: linkData.url || "https://google.com",
        category: linkData.category || "work",
        iconName: linkData.iconName || linkData.name || "Globe",
        shortcutKey: linkData.shortcutKey,
        clickCount: 0,
      };
      setLinks((prev) => [...prev, newLink]);
    }
  };
  const handleDeleteLink = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };
  /**
   * ==========================================
   * MAIN RENDER: UI STRUCTURE
   * ==========================================
   * Here is where the actual HTML/JSX is returned to draw the screen.
   * It uses a CSS Grid to create the Bento Box layout.
   */
  return (
    <div
      className={`min-h-screen p-2 sm:p-5 lg:p-8 flex items-center justify-center font-sans relative overflow-x-hidden selection:bg-[#F25C23] selection:text-white transition-colors ${isDark ? "bg-[#0A0A0C]" : "bg-[#E5E5E2]"}`}
    >
      {/* Background Stage Ambient Glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr pointer-events-none rounded-full blur-3xl ${isDark ? "from-[#F25C23]/15 via-[#FF5A1F]/10 to-transparent" : "from-[#F25C23]/10 via-[#FF5A1F]/5 to-transparent"}`}
      />

      {/* Main Framed Application Canvas */}
      <div
        className={`w-full max-w-[1440px] border-4 rounded-[24px] sm:rounded-[32px] overflow-hidden relative z-10 flex flex-col my-auto transition-colors ${isDark ? "bg-[#121214] border-[#3F3F46] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]" : "bg-[#F5F5F3] border-[#171717] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"}`}
      >
        {/* Top Navigation */}
        <TopNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          isUnlockedVault={isUnlockedVault}
        />

        {/* Master Asymmetric Bento Grid Canvas */}
        <main className="p-3 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 flex-1">
          {/* Active View / Breadcrumb Filter Header when a specific module tab is selected */}
          {activeTab !== "dashboard" && (
            <div
              className={`p-3.5 px-4 sm:px-5 rounded-2xl border-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200 ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-[#FFFFFF] border-[#171717] text-[#171717]"}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F25C23] animate-ping" />
                <span className="font-mono text-xs font-bold text-[#F25C23] uppercase tracking-wider">
                  FOCUS VIEW //
                </span>
                <span className="font-heading text-sm sm:text-base font-extrabold uppercase">
                  {activeTab === "launchpad" && "⚡ QUICK LAUNCHPAD"}
                  {activeTab === "vault" && "🔒 ENCRYPTED PRIVATE VAULT"}
                  {activeTab === "playlists" && "🎵 LO-FI BEATS & PLAYLISTS"}
                  {activeTab === "tools" && "🛠️ DEVELOPER WORKSPACE TOOLS"}
                  {activeTab === "scratchpad" &&
                    "📝 SCRATCHPAD & COMMAND BUFFER"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-1.5 rounded-lg border-2 font-heading text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:translate-y-0.5 ${isDark ? "bg-[#27272A] border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-stone-200" : "bg-[#F5F5F3] border-[#171717] hover:bg-[#F25C23] hover:text-white text-[#171717]"}`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#F25C23] group-hover:text-white" />
                  <span>OVERVIEW (ALL MODULES)</span>
                </button>
              </div>
            </div>
          )}

          {/* RENDER CONDITIONS BASED ON ACTIVETAB */}
          {activeTab === "dashboard" ? (
            <>
              {/* TOP BENTO SECTION: QUICK LAUNCH (Hero) + PRIVATE VAULT (Tall Vertical) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 relative">
                {/* BLOCK A: QUICK LAUNCH (Hero Column - 8 Cols) */}
                <section
                  className={`lg:col-span-8 border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
                >
                  <QuickLaunch
                    links={links}
                    onOpenLink={handleOpenLink}
                    onAddLink={() => {
                      setEditingLink(null);
                      setIsAddLinkOpen(true);
                    }}
                    onEditLink={(link) => {
                      setEditingLink(link);
                      setIsAddLinkOpen(true);
                    }}
                    onDeleteLink={handleDeleteLink}
                  />
                </section>

                {/* BLOCK B: PRIVATE VAULT (Tall Vertical Right Column - 4 Cols) */}
                <section
                  className={`lg:col-span-4 border-3 rounded-2xl overflow-hidden relative transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
                >
                  <PrivateVault
                    isUnlocked={isUnlockedVault}
                    documents={vaultDocs}
                    onOpenVaultModal={() => setIsVaultModalOpen(true)}
                    onLockVault={() => setIsUnlockedVault(false)}
                  />
                </section>

                {/* SIGNATURE OVERLAPPING CIRCULAR "+" BUTTON at Intersection */}
                <OverlappingPlusButton
                  onClick={() => setIsQuickActionOpen(true)}
                />
              </div>

              {/* BOTTOM BENTO SECTION: PLAYLISTS + TOOLS + SCRATCHPAD */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
                {/* BLOCK C: YOUTUBE PLAYLISTS & FAVORITE TRACKS CUTOUT (4 Cols) */}
                <section
                  className={`md:col-span-1 lg:col-span-4 border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
                >
                  <PlaylistPanel
                    playlists={playlists}
                    onOpenPlaylist={handleOpenPlaylist}
                    onAddPlaylist={() => setIsAddPlaylistOpen(true)}
                  />
                </section>

                {/* BLOCK D: TOOLS & WORKSPACE (4 Cols) */}
                <section
                  className={`md:col-span-1 lg:col-span-4 border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
                >
                  <ToolsWorkspace
                    tools={tools}
                    onOpenTool={handleOpenTool}
                    onAddTool={() => setIsAddToolOpen(true)}
                  />
                </section>

                {/* BLOCK E: QUICK SCRATCHPAD (4 Cols) */}
                <section
                  className={`md:col-span-2 lg:col-span-4 border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
                >
                  <QuickScratchpad />
                </section>
              </div>
            </>
          ) : activeTab === "launchpad" ? (
            <section
              className={`border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
            >
              <QuickLaunch
                links={links}
                onOpenLink={handleOpenLink}
                onAddLink={() => {
                  setEditingLink(null);
                  setIsAddLinkOpen(true);
                }}
                onEditLink={(link) => {
                  setEditingLink(link);
                  setIsAddLinkOpen(true);
                }}
                onDeleteLink={handleDeleteLink}
              />
            </section>
          ) : activeTab === "vault" ? (
            <section
              className={`border-3 rounded-2xl overflow-hidden relative transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
            >
              <PrivateVault
                isUnlocked={isUnlockedVault}
                documents={vaultDocs}
                onOpenVaultModal={() => setIsVaultModalOpen(true)}
                onLockVault={() => setIsUnlockedVault(false)}
              />
            </section>
          ) : activeTab === "playlists" ? (
            <section
              className={`border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
            >
              <PlaylistPanel
                playlists={playlists}
                onOpenPlaylist={handleOpenPlaylist}
                onAddPlaylist={() => setIsAddPlaylistOpen(true)}
              />
            </section>
          ) : activeTab === "tools" ? (
            <section
              className={`border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
            >
              <ToolsWorkspace
                tools={tools}
                onOpenTool={handleOpenTool}
                onAddTool={() => setIsAddToolOpen(true)}
              />
            </section>
          ) : activeTab === "scratchpad" ? (
            <section
              className={`border-3 rounded-2xl overflow-hidden transition-colors ${isDark ? "border-[#3F3F46] shadow-editorial-dark bg-[#18181B]" : "border-[#171717] shadow-editorial bg-[#FFFFFF]"}`}
            >
              <QuickScratchpad />
            </section>
          ) : null}
        </main>

        {/* Footer Shortcut Command Strip */}
        <ShortcutBar
          links={links}
          onOpenLink={handleOpenLink}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
        />
      </div>

      {/**
       * ==========================================
       * POPUP MODALS SECTION
       * ==========================================
       * These components are invisible by default and only pop up
       * when triggered (like clicking Add Link or opening Search).
       */}
      {/* Interactive Modals */}
      <AddLinkModal
        isOpen={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        onSave={handleSaveLink}
        initialData={editingLink}
      />

      <VaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        isUnlocked={isUnlockedVault}
        onUnlockSuccess={() => setIsUnlockedVault(true)}
        documents={vaultDocs}
        onAddDocument={handleAddVaultDocument}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        links={links}
        playlists={playlists}
        tools={tools}
        documents={vaultDocs}
        onOpenLink={handleOpenLink}
        onOpenPlaylist={handleOpenPlaylist}
        onOpenTool={handleOpenTool}
        onOpenVault={() => setIsVaultModalOpen(true)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        links={links}
        onOpenLink={handleOpenLink}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenVault={() => setIsVaultModalOpen(true)}
      />

      <QuickActionMenu
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onAddLink={() => {
          setEditingLink(null);
          setIsAddLinkOpen(true);
        }}
        onAddPlaylist={() => setIsAddPlaylistOpen(true)}
        onAddTool={() => setIsAddToolOpen(true)}
        onToggleVault={() => setIsVaultModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <AddPlaylistModal
        isOpen={isAddPlaylistOpen}
        onClose={() => setIsAddPlaylistOpen(false)}
        onSave={(data) => {
          if (data.title) {
            setPlaylists((prev) => [data, ...prev]);
          }
        }}
      />

      <AddToolModal
        isOpen={isAddToolOpen}
        onClose={() => setIsAddToolOpen(false)}
        onSave={(data) => {
          if (data.name) {
            setTools((prev) => [data, ...prev]);
          }
        }}
        isDark={isDark}
      />

      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenVault={() => setIsVaultModalOpen(true)}
      />
    </div>
  );
};
