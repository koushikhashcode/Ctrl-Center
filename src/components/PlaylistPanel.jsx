/**
 * ==========================================
 * COMPONENT: PlaylistPanel
 * ==========================================
 * The module that contains embedded YouTube videos or music players.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Plus,
  ExternalLink,
  Disc,
  Copy,
  Check,
  X,
  Sparkles,
  Music,
  Heart,
  Volume2,
  Flame,
  Folder,
  FolderPlus,
  Zap,
  Coffee,
  Headphones,
  Trash2,
  ArrowLeft,
  Radio,
  Search,
  FolderOpen,
  Pause,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { INITIAL_MUSIC_FOLDERS } from "../data/defaultData";
export const PlaylistPanel = ({ playlists, onOpenPlaylist, onAddPlaylist }) => {
  const { isDark } = useTheme();
  const [folders, setFolders] = useState(INITIAL_MUSIC_FOLDERS);

  // Auto-sync during development hot reloads if you edit defaultData.jsx
  useEffect(() => {
    setFolders(INITIAL_MUSIC_FOLDERS);
  }, [INITIAL_MUSIC_FOLDERS]);
  // Active view states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  // Form states for adding a new folder
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderCategory, setNewFolderCategory] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#F25C23");
  const [newFolderIcon, setNewFolderIcon] = useState("Music");
  // Form states for adding a new song
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [newSongDuration, setNewSongDuration] = useState("");
  const [newSongGenre, setNewSongGenre] = useState("");
  const [targetFolderId, setTargetFolderId] = useState("");
  // Persist folders to localStorage (REMOVED: we now read directly from code)
  // useEffect(() => {
  //   localStorage.setItem("ctrl_center_music_folders_v5", JSON.stringify(folders));
  // }, [folders]);
  // Helper to get total songs across all folders
  const totalSongsCount = folders.reduce(
    (sum, f) => sum + (f.songs?.length || 0),
    0,
  );
  // Get active folder object
  const activeFolder = folders.find((f) => f.id === selectedFolderId) || null;
  // Folder Icon rendering helper
  const renderFolderIcon = (iconName, className = "w-5 h-5") => {
    switch (iconName?.toLowerCase()) {
      case "coffee":
        return <Coffee className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "headphones":
        return <Headphones className={className} />;
      case "flame":
        return <Flame className={className} />;
      case "heart":
        return <Heart className={className} />;
      case "radio":
        return <Radio className={className} />;
      case "disc":
        return <Disc className={className} />;
      default:
        return <Music className={className} />;
    }
  };
  // Active playing states
  const [playingSongId, setPlayingSongId] = useState(null);
  const audioRef = useRef(null);

  // Clean up audio player on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handler to play/pause a song
  const handlePlaySong = (song, e) => {
    if (e) e.stopPropagation();
    if (!song.url) return;

    // Check if the URL is a local MP3
    const isLocalMp3 = song.url.endsWith(".mp3") || song.url.includes("/music/");

    if (isLocalMp3) {
      if (playingSongId === song.id) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setPlayingSongId(null);
      } else {
        // Stop currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // Play new track
        const audio = new Audio(song.url);
        audioRef.current = audio;
        audio.play().catch((err) => console.error("Error playing local MP3:", err));
        setPlayingSongId(song.id);

        audio.onended = () => {
          setPlayingSongId(null);
        };
      }
    } else {
      // Fallback for youtube or general links
      const cleanUrl = song.url.startsWith("http") || song.url.startsWith("/")
        ? song.url
        : `https://${song.url}`;
      window.open(cleanUrl, "_blank", "noopener,noreferrer");
    }
  };
  // Handler to copy song URL
  const handleCopySong = (song, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(song.url);
    setCopiedId(song.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  // Handler to delete song from a specific folder
  const handleDeleteSong = (folderId, songId, e) => {
    e.stopPropagation();
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          return {
            ...f,
            songs: f.songs.filter((s) => s.id !== songId),
          };
        }
        return f;
      }),
    );
  };
  // Handler to create a new folder
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const newFolder = {
      id: `mf-${Date.now()}`,
      name: newFolderName.trim(),
      category: newFolderCategory.trim() || "Custom Playlist",
      description:
        newFolderDescription.trim() || "User curated sound collection",
      color: newFolderColor || "#F25C23",
      iconName: newFolderIcon || "Music",
      songs: [],
    };
    setFolders((prev) => [...prev, newFolder]);
    setSelectedFolderId(newFolder.id);
    setNewFolderName("");
    setNewFolderCategory("");
    setNewFolderDescription("");
    setIsAddingFolder(false);
  };
  // Handler to delete a folder
  const handleDeleteFolder = (folderId, e) => {
    e.stopPropagation();
    if (folders.length <= 1) return;
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };
  // Handler to add a song to a particular folder
  const handleAddSongToFolder = (e) => {
    e.preventDefault();
    if (!newSongTitle.trim() || !newSongUrl.trim()) return;
    const folderToUseId = targetFolderId || selectedFolderId || folders[0]?.id;
    if (!folderToUseId) return;
    const targetF = folders.find((f) => f.id === folderToUseId);
    const newSong = {
      id: `song-${Date.now()}`,
      title: newSongTitle.trim(),
      artist: newSongArtist.trim() || "Various Artists",
      duration: newSongDuration.trim() || "3:30",
      url: newSongUrl.trim().startsWith("http")
        ? newSongUrl.trim()
        : `https://${newSongUrl.trim()}`,
      genre: newSongGenre.trim() || targetF?.category || "Music",
      folderId: folderToUseId,
    };
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderToUseId) {
          return {
            ...f,
            songs: [newSong, ...f.songs],
          };
        }
        return f;
      }),
    );
    // Reset form
    setNewSongTitle("");
    setNewSongArtist("");
    setNewSongUrl("");
    setNewSongDuration("");
    setNewSongGenre("");
    setIsAddingSong(false);
  };
  // Filtered list for search inside vault
  const filteredFolders = folders.map((f) => {
    if (!searchQuery.trim()) return f;
    const q = searchQuery.toLowerCase();
    const matchesFolder =
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    const matchingSongs = f.songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.genre && s.genre.toLowerCase().includes(q)),
    );
    return {
      ...f,
      songs: matchesFolder ? f.songs : matchingSongs,
      isMatching: matchesFolder || matchingSongs.length > 0,
    };
  });
  // Color options for folder creation - strictly adhering to website palette
  const colorOptions = [
    {
      label: "Studio Orange",
      value: "#F25C23",
    },
    {
      label: "Deep Charcoal",
      value: "#18181B",
    },
    {
      label: "Zinc Dark",
      value: "#27272A",
    },
    {
      label: "Pure Black",
      value: "#171717",
    },
  ];
  const iconOptions = [
    {
      label: "Music",
      value: "Music",
      icon: Music,
    },
    {
      label: "Lo-Fi Coffee",
      value: "Coffee",
      icon: Coffee,
    },
    {
      label: "Cyber Synth",
      value: "Zap",
      icon: Zap,
    },
    {
      label: "Focus Audio",
      value: "Headphones",
      icon: Headphones,
    },
    {
      label: "High Energy",
      value: "Flame",
      icon: Flame,
    },
    {
      label: "Indie Heart",
      value: "Heart",
      icon: Heart,
    },
    {
      label: "Radio Broadcast",
      value: "Radio",
      icon: Radio,
    },
    {
      label: "Vinyl Disc",
      value: "Disc",
      icon: Disc,
    },
  ];
  return (
    <div
      className={`youtube-playlist-container w-full block p-3 sm:p-4 flex flex-col justify-between h-full relative transition-colors ${isDark ? "bg-[#18181B] text-white" : "bg-[#FFFFFF] text-[#171717]"}`}
    >
      {/* 1ST DIV: UPPER PLAYLIST CARD AREA */}
      <div
        className={`w-full rounded-2xl p-3 sm:p-4 flex flex-col border-3 relative transition-colors ${isDark ? "bg-[#27272A] border-[#3F3F46] text-white shadow-editorial-sm-dark" : "bg-[#F5F5F3] border-[#171717] text-[#171717]"}`}
      >
        <div>
          {/* Header */}
          <div
            className={`flex items-center justify-between border-b-2 pb-2.5 mb-2.5 ${isDark ? "border-[#3F3F46]" : "border-[#171717]"}`}
          >
            <div className="flex items-center gap-2">
              <div className="bg-[#171717] text-[#F25C23] p-1.5 rounded-md border border-[#3F3F46]">
                <Play className="w-4 h-4 fill-[#F25C23]" />
              </div>
              <h2 className="font-heading text-base sm:text-lg font-extrabold tracking-wide uppercase">
                YOUTUBE PLAYLISTS
              </h2>
            </div>

            <button
              onClick={onAddPlaylist}
              className={`p-1.5 rounded-md hover:bg-[#F25C23] hover:text-white border-2 transition-colors cursor-pointer shadow-editorial-sm ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
              title="Add Playlist"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Playlist Strip List */}
          <div className="space-y-2 my-1">
            {playlists.map((pl) => (
              <motion.div
                key={pl.id}
                onClick={() => onOpenPlaylist(pl)}
                whileTap={{
                  scale: 0.97,
                }}
                whileHover={{
                  scale: 1.01,
                  x: 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 25,
                }}
                className={`group border-2 rounded-lg p-2 sm:p-2.5 flex items-center justify-between cursor-pointer touch-manipulation select-none transition-all ${isDark ? "bg-[#18181B] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white" : "bg-white hover:bg-[#171717] hover:text-white border-[#171717] text-[#171717]"}`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-md bg-[#171717] group-hover:bg-[#F25C23] text-white flex items-center justify-center font-heading font-bold text-xs border border-[#171717] flex-shrink-0 transition-colors">
                    ▶
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-sans font-extrabold text-xs sm:text-sm truncate">
                      {pl.title}
                    </h3>
                    <div
                      className={`flex items-center gap-1.5 text-[10px] font-mono mt-0.5 ${isDark ? "text-stone-300 group-hover:text-white/80" : "text-[#171717]/70 group-hover:text-white/80"}`}
                    >
                      <span className="font-bold">{pl.videoCount} videos</span>
                      <span>• {pl.category}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border group-hover:border-white group-hover:bg-[#F25C23] flex items-center justify-center transition-colors flex-shrink-0 ${isDark ? "border-[#3F3F46]" : "border-[#171717]"}`}
                >
                  <ExternalLink className="w-3 h-3 text-current" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 2ND DIV: 5 MUSIC FOLDERS AUDIO VAULT WIDGET */}
      <div className="w-full mt-3 sm:mt-3.5 relative z-10">
        <motion.div
          id="music-vault-folder-widget"
          onClick={() => {
            setSelectedFolderId(null);
            setIsModalOpen(true);
          }}
          whileTap={{
            scale: 0.98,
          }}
          whileHover={{
            scale: 1.01,
            y: -2,
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 25,
          }}
          className={`w-full rounded-2xl border-3 p-3 sm:p-4 flex items-center justify-between cursor-pointer touch-manipulation select-none transition-all group relative overflow-hidden ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white shadow-[4px_4px_0px_0px_#3F3F46] hover:bg-[#F25C23] hover:border-[#F25C23] hover:text-white" : "bg-[#F5F5F3] border-[#171717] text-[#171717] shadow-editorial hover:bg-[#F25C23] hover:text-white"}`}
        >
          {/* Subtle Background Accent Texture */}
          <div
            className={`absolute top-0 right-0 w-28 h-full bg-gradient-to-l pointer-events-none group-hover:opacity-0 ${isDark ? "from-white/5 to-transparent" : "from-[#171717]/5 to-transparent"}`}
          />

          <div className="min-w-0 pr-3 relative z-10 flex-1">
            {/* Distinctive Header Tag */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span
                className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm transition-colors ${isDark ? "bg-[#27272A] text-white border border-[#3F3F46] group-hover:bg-white group-hover:text-[#171717]" : "bg-[#171717] text-white border border-[#171717] group-hover:bg-white group-hover:text-[#171717]"}`}
              >
                <FolderOpen className="w-3 h-3 text-[#F25C23]" />
                {folders.length} MUSIC FOLDERS
              </span>
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${isDark ? "bg-white/10 text-[#F25C23] group-hover:bg-white/20 group-hover:text-white" : "bg-[#171717]/10 text-[#F25C23] group-hover:bg-white/20 group-hover:text-white"}`}
              >
                <Volume2 className="w-3 h-3 animate-pulse" />
                AUDIO VAULT
              </span>
            </div>

            {/* Title */}
            <div
              className={`font-heading font-black text-sm sm:text-base truncate uppercase tracking-tight flex items-center gap-2 group-hover:text-white transition-colors ${isDark ? "text-white" : "text-[#171717]"}`}
            >
              <span className="truncate">MY FAVORITE SOUND FOLDERS</span>
            </div>

            {/* Folder categories mini badge strip */}
            <div
              className={`flex items-center gap-1 mt-1 overflow-x-hidden text-[9px] font-mono font-bold group-hover:text-white transition-colors ${isDark ? "text-stone-400 opacity-90" : "text-stone-600"}`}
            >
              <span className="truncate">
                {folders
                  .slice(0, 3)
                  .map((f) => f.name.split(" ")[0])
                  .join(" • ")}
                {folders.length > 3 ? ` +${folders.length - 3} more` : ""}
              </span>
              <span className="shrink-0">• {totalSongsCount} SOUNDS ↗</span>
            </div>
          </div>

          {/* Right Icon Hub - Realistic Rotating Vinyl LP Disc with Folder Emblem */}
          <div className="relative flex-shrink-0 z-10 pl-1">
            {/* Circular Vinyl LP Disc Container */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center relative shadow-md group-hover:scale-105 group-hover:border-white transition-all overflow-hidden ${isDark ? "border-[#3F3F46]" : "border-[#171717]"}`}
            >
              <div className="w-full h-full rounded-full relative flex items-center justify-center animate-spin-slow">
                {/* Vinyl Grooves Texture */}
                <div
                  className="w-full h-full rounded-full bg-[#111113] border border-black/80 flex items-center justify-center relative shadow-inner overflow-hidden"
                  style={{
                    backgroundImage: `radial-gradient(circle, #1c1c20 0%, #0d0d0f 25%, #18181c 45%, #0a0a0c 65%, #161619 85%, #050506 100%)`,
                  }}
                >
                  {/* Fine Concentric Groove Rings */}
                  <div className="absolute inset-1 rounded-full border border-white/10" />
                  <div className="absolute inset-2 rounded-full border border-white/10" />
                  <div className="absolute inset-3 rounded-full border border-white/10" />
                  <div className="absolute inset-4 rounded-full border border-white/5" />

                  {/* Dynamic Conical Specular Light Reflection Glare */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        "conic-gradient(from 45deg at 50% 50%, rgba(255,255,255,0.22) 0deg, transparent 40deg, transparent 180deg, rgba(255,255,255,0.22) 220deg, transparent 260deg)",
                    }}
                  />

                  {/* Center Record Label */}
                  <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#F25C23] group-hover:bg-white border-2 border-[#171717] flex items-center justify-center relative z-10 shadow transition-colors">
                    <div className="w-3.5 h-3.5 rounded-full border border-black/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#000] border border-white/60 flex items-center justify-center shadow-inner">
                        <div className="w-0.5 h-0.5 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Folder Badge Indicator */}
            <div
              className={`absolute -top-1 -right-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center shadow-md z-20 group-hover:bg-white group-hover:border-[#171717] transition-colors ${isDark ? "bg-[#27272A] border-[#3F3F46]" : "bg-white border-[#171717]"}`}
            >
              <Folder className="w-2.5 h-2.5 text-[#F25C23]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* POP-UP MODAL WINDOW: 5-FOLDER MUSIC VAULT & TRACKS */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            id="music-vault-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
          >
            {/* Modal Backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => {
                setIsModalOpen(false);
                setIsAddingFolder(false);
                setIsAddingSong(false);
              }}
            />

            {/* Modal Container */}
            <motion.div
              id="music-vault-modal-container"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 12,
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
              }}
              className={`relative z-10 w-full max-w-3xl rounded-2xl border-3 shadow-editorial-lg max-h-[90vh] flex flex-col justify-between overflow-hidden my-4 ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
            >
              {/* Modal Top Header */}
              <div
                className={`p-4 sm:p-5 border-b-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isDark ? "bg-[#121214] border-[#3F3F46]" : "bg-[#171717] text-white border-[#171717]"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#27272A] text-[#F25C23] p-2.5 rounded-xl border border-[#3F3F46]">
                    <Disc className="w-6 h-6 animate-spin-slow text-[#F25C23]" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-2xl font-extrabold tracking-wide">
                      AUDIO VAULT & MUSIC FOLDERS
                    </h2>
                    <p className="text-xs font-mono text-stone-400">
                      {totalSongsCount} Curated Tracks Across {folders.length}{" "}
                      Distinct Music Genres
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Button to Add Folder */}
                  <button
                    id="add-music-folder-btn"
                    onClick={() => {
                      setIsAddingFolder(true);
                      setIsAddingSong(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-editorial-sm transition-all"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ NEW FOLDER</span>
                  </button>

                  {/* Button to Add Music */}
                  <button
                    id="add-music-track-btn"
                    onClick={() => {
                      setIsAddingSong(true);
                      setIsAddingFolder(false);
                      setTargetFolderId(
                        selectedFolderId || folders[0]?.id || "",
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ ADD MUSIC</span>
                  </button>

                  {/* Close button */}
                  <button
                    id="close-music-vault-btn"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 max-h-[65vh]">
                {/* 1. ADD NEW FOLDER FORM DRAWER */}
                {isAddingFolder && (
                  <form
                    onSubmit={handleCreateFolder}
                    className={`p-4 rounded-2xl border-2 space-y-3.5 animate-in fade-in duration-200 ${isDark ? "bg-[#27272A] border-[#F25C23]" : "bg-[#F5F5F3] border-[#F25C23]"}`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-[#3F3F46]/50">
                      <div className="flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-[#F25C23]" />
                        <h4 className="font-heading font-extrabold text-sm uppercase text-[#F25C23]">
                          Create New Music Folder
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingFolder(false)}
                        className="text-stone-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                          Folder Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jazz & Blues Cafe, Classical Study"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                          Music Type / Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Smooth Jazz, Classical, Hip Hop"
                          value={newFolderCategory}
                          onChange={(e) => setNewFolderCategory(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Relaxing brass, piano solos and coffee vibe rhythms"
                        value={newFolderDescription}
                        onChange={(e) =>
                          setNewFolderDescription(e.target.value)
                        }
                        className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                      />
                    </div>

                    {/* Color & Icon Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1.5">
                          Theme Color
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {colorOptions.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setNewFolderColor(c.value)}
                              className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${newFolderColor === c.value ? "scale-125 border-white shadow-sm" : "border-transparent hover:scale-110"}`}
                              style={{
                                backgroundColor: c.value,
                              }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1.5">
                          Folder Icon
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {iconOptions.map((opt) => {
                            const IconComp = opt.icon;
                            const isSel = newFolderIcon === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setNewFolderIcon(opt.value)}
                                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${isSel ? "bg-[#F25C23] text-white border-[#F25C23]" : isDark ? "bg-[#18181B] border-[#3F3F46] text-stone-400 hover:text-white" : "bg-white border-stone-300 text-[#171717]"}`}
                                title={opt.label}
                              >
                                <IconComp className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingFolder(false)}
                        className="px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold text-stone-400 hover:text-white"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading font-bold text-xs shadow-editorial-sm"
                      >
                        CREATE FOLDER
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. ADD NEW MUSIC FORM DRAWER */}
                {isAddingSong && (
                  <form
                    onSubmit={handleAddSongToFolder}
                    className={`p-4 rounded-2xl border-2 space-y-3.5 animate-in fade-in duration-200 ${isDark ? "bg-[#27272A] border-[#F25C23]" : "bg-[#F5F5F3] border-[#F25C23]"}`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-[#3F3F46]/50">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#F25C23]" />
                        <h4 className="font-heading font-extrabold text-sm uppercase text-[#F25C23]">
                          Add Music To Folder
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingSong(false)}
                        className="text-stone-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Target Folder Selector */}
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                        Select Destination Folder *
                      </label>
                      <select
                        value={
                          targetFolderId || selectedFolderId || folders[0]?.id
                        }
                        onChange={(e) => setTargetFolderId(e.target.value)}
                        className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                      >
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            📁 {f.name} ({f.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                          Song Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Starboy, Resonance"
                          value={newSongTitle}
                          onChange={(e) => setNewSongTitle(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                          Artist / Creator
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. The Weeknd, Lofi Girl"
                          value={newSongArtist}
                          onChange={(e) => setNewSongArtist(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                          Audio / YouTube URL *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={newSongUrl}
                          onChange={(e) => setNewSongUrl(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                          Duration (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 3:45 or Live"
                          value={newSongDuration}
                          onChange={(e) => setNewSongDuration(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-[#F25C23] ${isDark ? "bg-[#18181B] border-[#3F3F46] text-white" : "bg-white border-[#171717] text-[#171717]"}`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingSong(false)}
                        className="px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold text-stone-400 hover:text-white"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading font-bold text-xs shadow-editorial-sm"
                      >
                        SAVE MUSIC TO FOLDER
                      </button>
                    </div>
                  </form>
                )}



                {/* 3. VIEW MODE A: ALL 5 FOLDERS GRID OVERVIEW */}




                {selectedFolderId === null ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-sm uppercase tracking-wide">
                          MUSIC FOLDER DIRECTORY ({folders.length})
                        </span>
                      </div>
                      <div className="relative min-w-[170px] sm:min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Filter folders or songs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full py-1 pl-7 pr-2.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F25C23] border ${isDark ? "bg-[#27272A] border-[#3F3F46] text-white placeholder-stone-500" : "bg-white border-[#171717] text-[#171717] placeholder-stone-400"}`}
                        />
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Folder Cards Grid - Compact Quick Launch Style */}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                      {filteredFolders.map((folder) => {
                        const songCount = folder.songs?.length || 0;
                        return (
                          <motion.div
                            key={folder.id}
                            onClick={() => setSelectedFolderId(folder.id)}
                            whileHover={{
                              scale: 1.03,
                              y: -3,
                            }}
                            whileTap={{
                              scale: 0.94,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 25,
                            }}
                            className={`w-full h-32 sm:h-36 border-2 rounded-xl p-2.5 flex flex-col items-center justify-between cursor-pointer group select-none relative overflow-hidden touch-manipulation transition-all ${isDark ? "bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white shadow-editorial-sm-dark" : "bg-white hover:bg-[#F25C23] hover:text-white border-[#171717] text-[#171717] shadow-editorial-sm"}`}
                          >
                            {/* Top Badges */}
                            <div className="w-full flex items-center justify-between">
                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors ${isDark ? "bg-[#18181B] border-[#3F3F46] text-stone-300 group-hover:bg-[#171717] group-hover:text-white group-hover:border-transparent" : "bg-[#F5F5F3] border-[#171717] text-[#171717] group-hover:bg-[#171717] group-hover:text-white"}`}
                              >
                                {songCount}{" "}
                                {songCount === 1 ? "TRACK" : "TRACKS"}
                              </span>
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F25C23] group-hover:bg-white border border-black/20 shadow-xs transition-colors" />
                            </div>

                            {/* Center Icon */}
                            <div className="flex-1 flex items-center justify-center">
                              <div
                                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-sm border group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 ${isDark ? "bg-[#18181B] text-[#F25C23] border-[#3F3F46] group-hover:bg-[#171717] group-hover:text-white group-hover:border-transparent" : "bg-[#F5F5F3] text-[#F25C23] border-[#171717] group-hover:bg-[#171717] group-hover:text-white group-hover:border-transparent"}`}
                              >
                                {renderFolderIcon(folder.iconName, "w-5 h-5")}
                              </div>
                            </div>

                            {/* Bottom Label */}
                            <div className="w-full text-center">
                              <h4 className="font-heading font-black text-xs sm:text-[13px] truncate uppercase tracking-tight group-hover:text-white transition-colors">
                                {folder.name}
                              </h4>
                              <p className="text-[10px] font-mono font-semibold opacity-75 group-hover:opacity-95 truncate mt-0.5">
                                {folder.category}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Add Folder Quick Card */}
                      <motion.div
                        onClick={() => {
                          setIsAddingFolder(true);
                          setIsAddingSong(false);
                        }}
                        whileHover={{
                          scale: 1.03,
                          y: -3,
                        }}
                        whileTap={{
                          scale: 0.94,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 25,
                        }}
                        className={`w-full h-32 sm:h-36 border-2 border-dashed rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all ${isDark ? "border-[#3F3F46] hover:border-[#F25C23] bg-[#18181B]/60 hover:bg-[#27272A] text-stone-400 hover:text-white" : "border-stone-400 hover:border-[#F25C23] bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-[#171717]"}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#F25C23]/15 text-[#F25C23] flex items-center justify-center mb-1.5">
                          <FolderPlus className="w-5 h-5" />
                        </div>
                        <h4 className="font-heading font-extrabold text-xs uppercase tracking-tight">
                          + NEW FOLDER
                        </h4>
                        <p className="text-[9px] font-mono opacity-70 mt-0.5">
                          Custom Sound
                        </p>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* 4. VIEW MODE B: SPECIFIC FOLDER DETAIL & TRACKLIST */ activeFolder && (
                    <div className="space-y-4">
                      {/* Active Folder Banner */}
                      <div
                        className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isDark ? "bg-[#27272A] border-[#3F3F46]" : "bg-[#F5F5F3] border-[#171717]"}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <button
                            onClick={() => setSelectedFolderId(null)}
                            className="p-2 rounded-xl bg-[#18181B] hover:bg-[#F25C23] text-white border border-[#3F3F46] cursor-pointer transition-colors"
                            title="Back to All Folders"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>

                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border transition-all ${isDark ? "bg-[#18181B] text-[#F25C23] border-[#3F3F46]" : "bg-[#171717] text-[#F25C23] border-[#171717]"}`}
                          >
                            {renderFolderIcon(activeFolder.iconName, "w-6 h-6")}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-black text-lg sm:text-xl uppercase">
                                {activeFolder.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded bg-[#18181B] text-[#F25C23] font-mono text-[10px] font-bold border border-[#3F3F46]">
                                {activeFolder.category}
                              </span>
                            </div>
                            <p className="text-xs font-sans text-stone-400 mt-0.5">
                              {activeFolder.description} •{" "}
                              {activeFolder.songs?.length || 0} Tracks
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {/* Add Song Button for this folder */}
                          <button
                            onClick={() => {
                              setIsAddingSong(true);
                              setIsAddingFolder(false);
                              setTargetFolderId(activeFolder.id);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-editorial-sm transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD TRACK TO FOLDER</span>
                          </button>

                          {/* Delete folder if more than 1 */}
                          {folders.length > 1 && (
                            <button
                              onClick={(e) =>
                                handleDeleteFolder(activeFolder.id, e)
                              }
                              className="p-2 rounded-xl bg-[#18181B] hover:bg-rose-600 text-stone-400 hover:text-white border border-[#3F3F46] cursor-pointer transition-colors"
                              title="Delete this folder"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Song List in Active Folder */}
                      <div className="space-y-2">
                        {activeFolder.songs.length === 0 ? (
                          <div className="p-8 text-center border-2 border-dashed rounded-2xl font-mono text-sm text-stone-400 space-y-3">
                            <Music className="w-8 h-8 text-stone-500 mx-auto" />
                            <p>
                              No tracks added to &quot;{activeFolder.name}&quot;
                              yet.
                            </p>
                            <button
                              onClick={() => {
                                setIsAddingSong(true);
                                setTargetFolderId(activeFolder.id);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#F25C23] text-white font-heading text-xs font-bold shadow-editorial-sm"
                            >
                              + ADD FIRST SONG
                            </button>
                          </div>
                        ) : (
                          activeFolder.songs.map((song, idx) => (
                            <div
                              key={song.id}
                              onClick={() => handlePlaySong(song)}
                              className={`p-3 rounded-xl border-2 flex items-center justify-between group transition-all cursor-pointer select-none ${isDark ? "bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white shadow-editorial-sm-dark" : "bg-[#F5F5F3] hover:bg-[#171717] hover:text-white border-[#171717] text-[#171717] shadow-editorial-sm"}`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-3">
                                <span className="w-6 h-6 rounded-full bg-[#18181B] group-hover:bg-white text-stone-300 group-hover:text-[#171717] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-[#3F3F46]">
                                  {idx + 1}
                                </span>

                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 bg-[#F25C23] group-hover:bg-white group-hover:text-[#F25C23] transition-colors">
                                  {playingSongId === song.id ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <h4 className="font-heading font-extrabold text-xs sm:text-sm truncate group-hover:text-white">
                                    {song.title}
                                  </h4>
                                  <p className="text-[11px] font-mono opacity-80 truncate">
                                    {song.artist}{" "}
                                    {song.duration ? `• ${song.duration}` : ""}{" "}
                                    {song.genre ? `• ${song.genre}` : ""}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={(e) => handleCopySong(song, e)}
                                  className="p-1.5 rounded-lg border border-transparent group-hover:border-white/30 hover:bg-black/20 text-stone-300 group-hover:text-white transition-colors cursor-pointer"
                                  title="Copy URL"
                                >
                                  {copiedId === song.id ? (
                                    <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) =>
                                    handleDeleteSong(
                                      activeFolder.id,
                                      song.id,
                                      e,
                                    )
                                  }
                                  className="p-1.5 rounded-lg border border-transparent group-hover:border-white/30 hover:bg-black/20 text-stone-300 group-hover:text-white transition-colors cursor-pointer"
                                  title="Remove Track"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Modal Footer */}
              <div
                className={`p-3.5 sm:px-5 border-t-2 flex items-center justify-between text-xs font-mono ${isDark ? "border-[#3F3F46] bg-[#121214] text-stone-400" : "border-[#171717] bg-[#F5F5F3] text-[#171717]/70"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-[#F25C23]">
                    <Sparkles className="w-3.5 h-3.5" /> PERSISTED
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    {folders.length} Music Folders • {totalSongsCount} Total
                    Tracks
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFolderId !== null && (
                    <button
                      onClick={() => setSelectedFolderId(null)}
                      className="px-3 py-1 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-white font-mono text-xs cursor-pointer border border-[#3F3F46]"
                    >
                      VIEW ALL FOLDERS
                    </button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1 rounded-lg bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading font-bold text-xs cursor-pointer shadow-editorial-sm"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
