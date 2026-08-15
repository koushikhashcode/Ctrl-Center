/**
 * ==========================================
 * COMPONENT: QuickScratchpad
 * ==========================================
 * A simple text-area box used for jotting down temporary notes.
 */
import { useState, useEffect, useRef } from "react";
import {
  Edit3,
  Copy,
  Check,
  Trash2,
  Plus,
  FileText,
  Sparkles,
  Lock,
  Unlock,
  Save,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
const DEFAULT_NOTES = [
  {
    id: "1",
    title: "Daily Memo",
    content:
      "- Review pull requests\n- Deploy production release\n- Update API documentation",
    updatedAt: "Just now",
  },
  {
    id: "2",
    title: "Code Snippet",
    content: 'git commit -m "feat: add scratchpad widget" && git push',
    updatedAt: "Today",
  },
  {
    id: "3",
    title: "Quotes",
    content:
      "\"Work on your Dreams or someone else will hire you to work on theirs\" - Farrah Gray\n\n\n\" Act like you can't afford the bread until they find out you own the bakery\" ",
    updatedAt: "Today", 
  },    
];
export const QuickScratchpad = () => {
  const { isDark } = useTheme();
  // Local State
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("ctrl_center_scratchpad");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Force-sync the "Quotes" note from DEFAULT_NOTES so that code changes
        // immediately reflect in the UI (overriding what's in local storage).
        const defaultQuoteNote = DEFAULT_NOTES.find((n) => n.id === "3" || n.title === "Quotes");
        const existingQuoteIndex = parsed.findIndex((n) => n.id === "3" || n.title === "Quotes");
        
        if (existingQuoteIndex >= 0 && defaultQuoteNote) {
           parsed[existingQuoteIndex] = { ...parsed[existingQuoteIndex], content: defaultQuoteNote.content, title: defaultQuoteNote.title };
        } else if (defaultQuoteNote) {
           parsed.push(defaultQuoteNote);
        }
        
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    }
    return DEFAULT_NOTES;
  });
  const [activeNoteId, setActiveNoteId] = useState(() => notes[0]?.id || "1");
  const [copied, setCopied] = useState(false);
  
  // Ref for auto-expanding textarea
  const textareaRef = useRef(null);

  // Backend Sync & Autosave State
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState(() => {
    const saved = localStorage.getItem("ctrl_center_scratchpad_autosave");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [saveStatus, setSaveStatus] = useState("saved");
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const autosaveTimerRef = useRef(null);
  const isInitialMount = useRef(true);
  // Persist autosave preference
  useEffect(() => {
    localStorage.setItem(
      "ctrl_center_scratchpad_autosave",
      JSON.stringify(isAutosaveEnabled),
    );
  }, [isAutosaveEnabled]);
  // Fetch initial notes from Backend Server on mount
  useEffect(() => {
    const fetchBackendNotes = async () => {
      try {
        const response = await fetch("/api/notes");
        if (response.ok) {
          const data = await response.json();
          if (
            data.notes &&
            Array.isArray(data.notes) &&
            data.notes.length > 0
          ) {
            setNotes(data.notes);
            if (!data.notes.some((n) => n.id === activeNoteId)) {
              setActiveNoteId(data.notes[0].id);
            }
            setSaveStatus("saved");
            setLastSavedTime(
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            );
          }
        }
      } catch (err) {
        console.warn("Backend server unavailable, using local cache:", err);
      }
    };
    fetchBackendNotes();
  }, []);
  // Save Function to sync notes to backend API
  const saveToBackend = async (notesToSave) => {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notesToSave,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSaveStatus("saved");
        const now = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setLastSavedTime(now);
        // Backup to LocalStorage
        localStorage.setItem(
          "ctrl_center_scratchpad",
          JSON.stringify(notesToSave),
        );
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Failed to save notes to backend:", error);
      setSaveStatus("error");
      // Save locally as fallback
      localStorage.setItem(
        "ctrl_center_scratchpad",
        JSON.stringify(notesToSave),
      );
    }
  };
  // Handle Notes Mutation with Autosave logic
  useEffect(() => {
    // Save to localStorage immediately as client backup
    localStorage.setItem("ctrl_center_scratchpad", JSON.stringify(notes));
    // Skip trigger on initial load mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isAutosaveEnabled) {
      setSaveStatus("unsaved");
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        saveToBackend(notes);
      }, 800);
    } else {
      setSaveStatus("unsaved");
    }
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [notes, isAutosaveEnabled]);
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [activeNote?.content, activeNoteId]);

  const handleUpdateContent = (newContent) => {
    if (activeNote?.isLocked) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? {
              ...n,
              content: newContent,
              updatedAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : n,
      ),
    );
  };
  const handleUpdateTitle = (newTitle) => {
    if (activeNote?.isLocked) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? {
              ...n,
              title: newTitle,
            }
          : n,
      ),
    );
  };
  const handleToggleLock = (id) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isLocked: !n.isLocked,
            }
          : n,
      ),
    );
  };
  const handleAddNote = () => {
    const newId = Date.now().toString();
    const newNote = {
      id: newId,
      title: `Note ${notes.length + 1}`,
      content: "",
      updatedAt: "Just now",
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setActiveNoteId(newId);
    if (isAutosaveEnabled) {
      saveToBackend(updatedNotes);
    }
  };
  const handleDeleteNote = (id) => {
    let updated;
    if (notes.length <= 1) {
      updated = [
        {
          id: "1",
          title: "Quick Note",
          content: "",
          updatedAt: "Just now",
        },
      ];
      setNotes(updated);
      setActiveNoteId("1");
    } else {
      updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      if (activeNoteId === id) {
        setActiveNoteId(updated[0].id);
      }
    }
    if (isAutosaveEnabled) {
      saveToBackend(updated);
    }
  };
  const handleManualSave = () => {
    saveToBackend(notes);
  };
  const handleCopyContent = () => {
    if (!activeNote?.content) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const charCount = activeNote?.content?.length || 0;
  const wordCount = activeNote?.content?.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;
  // ==========================================
  // UI CLASS HELPERS (For Readability)
  // ==========================================

  const getContainerClasses = () => {
    return `p-5 sm:p-6 flex flex-col justify-between h-full relative transition-colors overflow-y-auto overflow-x-hidden scrollbar-none ${
      isDark ? "bg-[#18181B] text-white" : "bg-[#FFFFFF] text-[#171717]"
    }`;
  };

  const getSaveBtnClasses = () => {
    const base =
      "group px-2.5 py-1.5 rounded-md border-2 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:translate-y-0.5";
    if (saveStatus === "saving") {
      return `${base} bg-[#F25C23] text-white border-[#F25C23]`;
    }
    if (saveStatus === "unsaved") {
      return `${base} bg-[#F25C23] hover:bg-[#d94a15] text-white border-[#171717] dark:border-stone-600 shadow-editorial-sm animate-pulse`;
    }
    return isDark
      ? `${base} bg-[#27272A] border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-stone-200`
      : `${base} bg-[#F5F5F3] border-[#171717] hover:bg-[#F25C23] hover:text-white text-[#171717]`;
  };

  const getIconBtnClasses = (isActive = false) => {
    const base =
      "p-1.5 rounded-md border-2 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono font-bold";
    if (isActive) {
      return `${base} bg-amber-500 text-black border-amber-500 shadow-sm`;
    }
    if (copied && !isActive) {
      return `${base} bg-[#F25C23] text-white border-[#171717] dark:border-white`;
    }
    return isDark
      ? `${base} bg-[#27272A] border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-stone-200`
      : `${base} bg-[#F5F5F3] border-[#171717] hover:bg-[#F25C23] hover:text-white text-[#171717]`;
  };

  const getTabClasses = (isActive) => {
    const base =
      "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-all cursor-pointer whitespace-nowrap";
    if (isActive) {
      return `${base} bg-[#F25C23] text-white border-[#F25C23] shadow-editorial-sm`;
    }
    return isDark
      ? `${base} bg-[#27272A] text-stone-300 border-[#3F3F46] hover:border-[#F25C23]`
      : `${base} bg-[#F5F5F3] text-[#171717] border-[#171717]/30 hover:border-[#171717]`;
  };

  const getTitleInputClasses = (isLocked) => {
    const base =
      "w-full font-heading font-bold text-sm bg-transparent border-b pb-1 focus:outline-none transition-colors";
    if (isLocked) {
      return `${base} cursor-not-allowed opacity-80 border-amber-500/50`;
    }
    return isDark
      ? `${base} text-white border-[#3F3F46] focus:border-[#F25C23]`
      : `${base} text-[#171717] border-[#171717]/20 focus:border-[#F25C23]`;
  };

  const getEditorClasses = (isLocked) => {
    const base =
      "w-full min-h-[150px] p-3 rounded-lg border-2 font-mono text-xs leading-relaxed resize-none focus:outline-none transition-colors overflow-hidden";
    if (isLocked) {
      return isDark
        ? `${base} bg-[#202023] border-amber-500/40 text-stone-300 cursor-not-allowed select-text`
        : `${base} bg-[#F0EFF0] border-amber-500/40 text-[#171717] cursor-not-allowed select-text`;
    }
    return isDark
      ? `${base} bg-[#27272A] border-[#3F3F46] text-stone-200 placeholder-stone-500 focus:border-[#F25C23]`
      : `${base} bg-[#F5F5F3] border-[#171717] text-[#171717] placeholder-[#171717]/50 focus:border-[#F25C23]`;
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className={getContainerClasses()}>
      {/* Header Section */}
      <div>
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b-2 pb-3 mb-3 ${isDark ? "border-[#3F3F46]" : "border-[#171717]"}`}
        >
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="bg-[#171717] text-[#F25C23] p-1.5 rounded-md border border-[#3F3F46]">
              <Edit3 className="w-5 h-5 text-[#F25C23]" />
            </div>
            <h2
              className={`font-heading text-2xl sm:text-3xl font-extrabold tracking-wide ${isDark ? "text-white" : "text-[#171717]"}`}
            >
              SCRATCHPAD
            </h2>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* MANUAL SAVE TO BACKEND BUTTON */}
            <button
              onClick={handleManualSave}
              disabled={saveStatus === "saving"}
              className={getSaveBtnClasses()}
              title="Save All Notes to Backend Database"
            >
              {saveStatus === "saving" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#F25C23] group-hover:text-white transition-colors" />
                  <span>SAVED</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE</span>
                </>
              )}
            </button>

            {/* LOCK BUTTON */}
            <button
              onClick={() => activeNote && handleToggleLock(activeNote.id)}
              className={getIconBtnClasses(activeNote?.isLocked)}
              title={
                activeNote?.isLocked
                  ? "Unlock Note to Allow Editing"
                  : "Lock Note to Protect Content"
              }
            >
              {activeNote?.isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">LOCKED</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 stroke-[2]" />
                  <span className="hidden sm:inline">LOCK</span>
                </>
              )}
            </button>

            {/* COPY BUTTON */}
            <button
              onClick={handleCopyContent}
              className={getIconBtnClasses()}
              title="Copy Scratchpad Content"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* NEW NOTE BUTTON */}
            <button
              onClick={handleAddNote}
              className={getIconBtnClasses()}
              title="New Note Tab"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Note Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {notes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={getTabClasses(isActive)}
              >
                {note.isLocked ? (
                  <Lock
                    className={`w-3 h-3 flex-shrink-0 ${isActive ? "text-white" : "text-amber-500"}`}
                  />
                ) : (
                  <FileText className="w-3 h-3 flex-shrink-0" />
                )}
                <span className="truncate max-w-[90px]">
                  {note.title || "Untitled"}
                </span>
                {notes.length > 1 && isActive && !note.isLocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="ml-1 hover:text-stone-900 cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Note Title Input */}
        {activeNote && (
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdateTitle(e.target.value)}
              readOnly={activeNote.isLocked}
              placeholder="Note Title..."
              className={getTitleInputClasses(activeNote.isLocked)}
            />
            {activeNote.isLocked && (
              <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
                <Lock className="w-3 h-3" /> READ-ONLY
              </span>
            )}
          </div>
        )}
      </div>

      {/* Editor Textarea */}
      <div className="flex-1 my-2 flex flex-col">
        <textarea
          ref={textareaRef}
          value={activeNote?.content || ""}
          onChange={(e) => handleUpdateContent(e.target.value)}
          readOnly={activeNote?.isLocked}
          placeholder={
            activeNote?.isLocked
              ? "This note is locked. Click LOCKED button above to unlock and edit."
              : "Type notes, quick command line snippets, or priorities here... Auto-saved to backend."
          }
          className={getEditorClasses(activeNote?.isLocked)}
        />
      </div>

      {/* Footer Info & Backend Persistence Status */}
      <div
        className={`pt-3 border-t-2 mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono ${isDark ? "border-[#3F3F46] text-stone-400" : "border-[#171717] text-[#171717]/70"}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
          <span>•</span>
          {/* Subtle Minute Auto-save Checkbox */}
          <label
            className="inline-flex items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity select-none text-[10px]"
            title={
              isAutosaveEnabled ? "Auto-save is active" : "Auto-save is off"
            }
          >
            <input
              type="checkbox"
              checked={isAutosaveEnabled}
              onChange={(e) => setIsAutosaveEnabled(e.target.checked)}
              className="w-3 h-3 accent-[#F25C23] cursor-pointer rounded-sm"
            />
            <span
              className={
                isAutosaveEnabled
                  ? "text-[#F25C23] font-semibold"
                  : "text-stone-400"
              }
            >
              Auto-save
            </span>
          </label>
        </div>

        {/* Backend Persistence Status Badge */}
        <div>
          {activeNote?.isLocked ? (
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> LOCKED (PROTECTED)
            </span>
          ) : saveStatus === "saving" ? (
            <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> SAVING TO
              BACKEND...
            </span>
          ) : saveStatus === "saved" ? (
            <span className="text-[#F25C23] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F25C23]" /> BACKEND SAVED (
              {lastSavedTime})
            </span>
          ) : saveStatus === "unsaved" ? (
            <span className="text-[#F25C23] font-bold flex items-center gap-1">
              <Save className="w-3 h-3 animate-bounce" />{" "}
              {isAutosaveEnabled
                ? "AUTOSAVING..."
                : "UNSAVED CHANGES (CLICK SAVE)"}
            </span>
          ) : (
            <span className="text-rose-500 font-bold flex items-center gap-1">
              • LOCAL BACKUP ONLY
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
