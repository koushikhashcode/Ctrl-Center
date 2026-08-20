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
import "./PlaylistPanel.css";

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
    <div className={`youtube-playlist-container ${isDark ? "theme-dark" : "theme-light"}`}>
      {/* 1ST DIV: UPPER PLAYLIST CARD AREA */}
      <div className={`youtube-playlist-card ${isDark ? "theme-dark" : "theme-light"}`}>
        <div>
          {/* Header */}
          <div className={`youtube-playlist-header ${isDark ? "theme-dark" : "theme-light"}`}>
            <div className="youtube-playlist-title-container">
              <div className="youtube-playlist-icon">
                <Play className="w-4 h-4 fill-[#F25C23]" />
              </div>
              <h2 className="youtube-playlist-title">
                YOUTUBE PLAYLISTS
              </h2>
            </div>

            <button
              onClick={onAddPlaylist}
              className={`youtube-playlist-add-btn ${isDark ? "theme-dark" : "theme-light"}`}
              title="Add Playlist"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Playlist Strip List */}
          <div className="youtube-playlist-list">
            {playlists.map((pl) => (
              <motion.div
                key={pl.id}
                onClick={() => onOpenPlaylist(pl)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01, x: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className={`youtube-playlist-item ${isDark ? "theme-dark" : "theme-light"}`}
              >
                <div className="youtube-playlist-item-left">
                  <div className="youtube-playlist-item-play">
                    ▶
                  </div>

                  <div className="youtube-playlist-item-info">
                    <h3 className="youtube-playlist-item-title">
                      {pl.title}
                    </h3>
                    <div className="youtube-playlist-item-meta">
                      <span className="youtube-playlist-item-meta-bold">{pl.videoCount} videos</span>
                      <span>• {pl.category}</span>
                    </div>
                  </div>
                </div>

                <div className="youtube-playlist-item-ext">
                  <ExternalLink className="w-3 h-3 text-current" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 2ND DIV: 5 MUSIC FOLDERS AUDIO VAULT WIDGET */}
      <div className="music-vault-widget-wrapper">
        <motion.div
          id="music-vault-folder-widget"
          onClick={() => {
            setSelectedFolderId(null);
            setIsModalOpen(true);
          }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className={`music-vault-widget ${isDark ? "theme-dark" : "theme-light"}`}
        >
          {/* Subtle Background Accent Texture */}
          <div className="music-vault-bg-accent" />

          <div className="music-vault-info">
            {/* Distinctive Header Tag */}
            <div className="music-vault-badges">
              <span className="music-vault-badge-folders">
                <FolderOpen className="w-3 h-3 text-[#F25C23]" />
                {folders.length} MUSIC FOLDERS
              </span>
              <span className="music-vault-badge-audio">
                <Volume2 className="w-3 h-3 animate-pulse" />
                AUDIO VAULT
              </span>
            </div>

            {/* Title */}
            <div className="music-vault-title">
              <span className="truncate">MY FAVORITE SOUND FOLDERS</span>
            </div>

            {/* Folder categories mini badge strip */}
            <div className="music-vault-subtitle">
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
          <div className="music-vault-disc-wrapper">
            {/* Circular Vinyl LP Disc Container */}
            <div className="music-vault-disc-container">
              <div className="music-vault-disc">
                {/* Vinyl Grooves Texture */}
                <div className="music-vault-disc-bg">
                  {/* Fine Concentric Groove Rings */}
                  <div className="music-vault-disc-groove music-vault-disc-groove-1" />
                  <div className="music-vault-disc-groove music-vault-disc-groove-2" />
                  <div className="music-vault-disc-groove music-vault-disc-groove-3" />
                  <div className="music-vault-disc-groove music-vault-disc-groove-4" />

                  {/* Dynamic Conical Specular Light Reflection Glare */}
                  <div className="music-vault-disc-reflection" />

                  {/* Center Record Label */}
                  <div className="music-vault-disc-label">
                    <div className="music-vault-disc-hole-outer">
                      <div className="music-vault-disc-hole-inner">
                        <div className="music-vault-disc-hole-dot" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Folder Badge Indicator */}
            <div className="music-vault-folder-badge">
              <Folder className="w-2.5 h-2.5 text-[#F25C23]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* POP-UP MODAL WINDOW: 5-FOLDER MUSIC VAULT & TRACKS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="music-vault-modal-backdrop">
            <div
              className="music-vault-modal-overlay"
              onClick={() => {
                setIsModalOpen(false);
                setIsAddingFolder(false);
                setIsAddingSong(false);
              }}
            />

            {/* Modal Container */}
            <motion.div
              id="music-vault-modal-container"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className={`music-vault-modal-container ${isDark ? "theme-dark" : "theme-light"}`}
            >
              {/* Modal Top Header */}
              <div className={`music-vault-modal-header ${isDark ? "theme-dark" : "theme-light"}`}>
                <div className="music-vault-modal-header-left">
                  <div className="music-vault-modal-icon-wrapper">
                    <Disc className="w-6 h-6 animate-spin-slow text-[#F25C23]" />
                  </div>
                  <div>
                    <h2 className="music-vault-modal-title">
                      AUDIO VAULT & MUSIC FOLDERS
                    </h2>
                    <p className="music-vault-modal-subtitle">
                      {totalSongsCount} Curated Tracks Across {folders.length}{" "}
                      Distinct Music Genres
                    </p>
                  </div>
                </div>

                <div className="music-vault-modal-header-right">
                  {/* Button to Add Folder */}
                  <button
                    id="add-music-folder-btn"
                    onClick={() => {
                      setIsAddingFolder(true);
                      setIsAddingSong(false);
                    }}
                    className="music-vault-btn-primary"
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
                    className="music-vault-btn-secondary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ ADD MUSIC</span>
                  </button>

                  {/* Close button */}
                  <button
                    id="close-music-vault-btn"
                    onClick={() => setIsModalOpen(false)}
                    className="music-vault-btn-close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="music-vault-modal-content">
                {/* 1. ADD NEW FOLDER FORM DRAWER */}
                {isAddingFolder && (
                  <form
                    onSubmit={handleCreateFolder}
                    className={`music-vault-form ${isDark ? "theme-dark" : "theme-light"}`}
                  >
                    <div className="music-vault-form-header">
                      <div className="music-vault-form-title">
                        <FolderPlus className="w-4 h-4" />
                        <h4>Create New Music Folder</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingFolder(false)}
                        className="music-vault-form-btn-cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="music-vault-form-label">
                          Folder Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jazz & Blues Cafe, Classical Study"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                      </div>

                      <div>
                        <label className="music-vault-form-label">
                          Music Type / Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Smooth Jazz, Classical, Hip Hop"
                          value={newFolderCategory}
                          onChange={(e) => setNewFolderCategory(e.target.value)}
                          className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="music-vault-form-label">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Relaxing brass, piano solos and coffee vibe rhythms"
                        value={newFolderDescription}
                        onChange={(e) => setNewFolderDescription(e.target.value)}
                        className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                      />
                    </div>

                    {/* Color & Icon Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="music-vault-form-label">
                          Theme Color
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {colorOptions.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setNewFolderColor(c.value)}
                              className={`music-vault-form-color-btn ${newFolderColor === c.value ? "selected" : ""}`}
                              style={{ backgroundColor: c.value }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="music-vault-form-label">
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
                                className={`music-vault-form-icon-btn ${isSel ? "selected" : isDark ? "theme-dark" : "theme-light"}`}
                                title={opt.label}
                              >
                                <IconComp className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="music-vault-form-actions">
                      <button
                        type="button"
                        onClick={() => setIsAddingFolder(false)}
                        className="music-vault-form-btn-cancel"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="music-vault-btn-submit"
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
                    className={`music-vault-form ${isDark ? "theme-dark" : "theme-light"}`}
                  >
                    <div className="music-vault-form-header">
                      <div className="music-vault-form-title">
                        <Plus className="w-4 h-4" />
                        <h4>Add Music To Folder</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingSong(false)}
                        className="music-vault-form-btn-cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Target Folder Selector */}
                    <div>
                      <label className="music-vault-form-label">
                        Select Destination Folder *
                      </label>
                      <select
                        value={targetFolderId || selectedFolderId || folders[0]?.id}
                        onChange={(e) => setTargetFolderId(e.target.value)}
                        className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
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
                        <label className="music-vault-form-label">
                          Song Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Starboy, Resonance"
                          value={newSongTitle}
                          onChange={(e) => setNewSongTitle(e.target.value)}
                          className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                      </div>

                      <div>
                        <label className="music-vault-form-label">
                          Artist / Creator
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. The Weeknd, Lofi Girl"
                          value={newSongArtist}
                          onChange={(e) => setNewSongArtist(e.target.value)}
                          className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="music-vault-form-label">
                          Audio / YouTube URL *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={newSongUrl}
                          onChange={(e) => setNewSongUrl(e.target.value)}
                          className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                      </div>

                      <div>
                        <label className="music-vault-form-label">
                          Duration (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 3:45 or Live"
                          value={newSongDuration}
                          onChange={(e) => setNewSongDuration(e.target.value)}
                          className={`music-vault-form-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                      </div>
                    </div>

                    <div className="music-vault-form-actions">
                      <button
                        type="button"
                        onClick={() => setIsAddingSong(false)}
                        className="music-vault-form-btn-cancel"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="music-vault-btn-submit"
                      >
                        SAVE MUSIC TO FOLDER
                      </button>
                    </div>
                  </form>
                )}



                {/* 3. VIEW MODE A: ALL 5 FOLDERS GRID OVERVIEW */}




                {selectedFolderId === null ? (
                  <div className="space-y-4">
                    <div className="music-vault-grid-header">
                      <div className="flex items-center gap-2">
                        <span className="music-vault-grid-title">
                          MUSIC FOLDER DIRECTORY ({folders.length})
                        </span>
                      </div>
                      <div className="music-vault-search-container">
                        <input
                          type="text"
                          placeholder="Filter folders or songs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`music-vault-search-input ${isDark ? "theme-dark" : "theme-light"}`}
                        />
                        <Search className="w-3.5 h-3.5 music-vault-search-icon" />
                      </div>
                    </div>

                    {/* Folder Cards Grid - Compact Quick Launch Style */}
                    <div className="music-vault-grid">
                      {filteredFolders.map((folder) => {
                        const songCount = folder.songs?.length || 0;
                        return (
                          <motion.div
                            key={folder.id}
                            onClick={() => setSelectedFolderId(folder.id)}
                            whileHover={{ scale: 1.03, y: -3 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                            className={`music-vault-folder-card ${isDark ? "theme-dark" : "theme-light"}`}
                          >
                            {/* Top Badges */}
                            <div className="music-vault-folder-card-top">
                              <span className="music-vault-folder-card-count">
                                {songCount} {songCount === 1 ? "TRACK" : "TRACKS"}
                              </span>
                              <span className="music-vault-folder-card-dot" />
                            </div>

                            {/* Center Icon */}
                            <div className="music-vault-folder-card-center">
                              <div className="music-vault-folder-card-icon">
                                {renderFolderIcon(folder.iconName, "w-5 h-5")}
                              </div>
                            </div>

                            {/* Bottom Label */}
                            <div className="music-vault-folder-card-bottom">
                              <h4 className="music-vault-folder-card-title">
                                {folder.name}
                              </h4>
                              <p className="music-vault-folder-card-subtitle">
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
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        className={`music-vault-add-folder-card ${isDark ? "theme-dark" : "theme-light"}`}
                      >
                        <div className="music-vault-add-folder-icon-wrapper">
                          <FolderPlus className="w-5 h-5" />
                        </div>
                        <h4 className="music-vault-add-folder-title">
                          + NEW FOLDER
                        </h4>
                        <p className="music-vault-add-folder-subtitle">
                          Custom Sound
                        </p>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* 4. VIEW MODE B: SPECIFIC FOLDER DETAIL & TRACKLIST */ activeFolder && (
                    <div className="space-y-4">
                      {/* Active Folder Banner */}
                      <div className={`music-vault-active-banner ${isDark ? "theme-dark" : "theme-light"}`}>
                        <div className="music-vault-active-banner-left">
                          <button
                            onClick={() => setSelectedFolderId(null)}
                            className="music-vault-back-btn"
                            title="Back to All Folders"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>

                          <div className={`music-vault-active-icon ${isDark ? "theme-dark" : "theme-light"}`}>
                            {renderFolderIcon(activeFolder.iconName, "w-6 h-6")}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="music-vault-active-title">
                                {activeFolder.name}
                              </h3>
                              <span className="music-vault-active-tag">
                                {activeFolder.category}
                              </span>
                            </div>
                            <p className="music-vault-active-desc">
                              {activeFolder.description} •{" "}
                              {activeFolder.songs?.length || 0} Tracks
                            </p>
                          </div>
                        </div>

                        <div className="music-vault-active-actions">
                          {/* Add Song Button for this folder */}
                          <button
                            onClick={() => {
                              setIsAddingSong(true);
                              setIsAddingFolder(false);
                              setTargetFolderId(activeFolder.id);
                            }}
                            className="music-vault-btn-primary"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD TRACK TO FOLDER</span>
                          </button>

                          {/* Delete folder if more than 1 */}
                          {folders.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteFolder(activeFolder.id, e)}
                              className="music-vault-del-btn"
                              title="Delete this folder"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Song List in Active Folder */}
                      <div className="music-vault-song-list">
                        {activeFolder.songs.length === 0 ? (
                          <div className="music-vault-empty-state">
                            <Music className="music-vault-empty-icon" />
                            <p>
                              No tracks added to &quot;{activeFolder.name}&quot;
                              yet.
                            </p>
                            <button
                              onClick={() => {
                                setIsAddingSong(true);
                                setTargetFolderId(activeFolder.id);
                              }}
                              className="music-vault-btn-submit"
                            >
                              + ADD FIRST SONG
                            </button>
                          </div>
                        ) : (
                          activeFolder.songs.map((song, idx) => (
                            <div
                              key={song.id}
                              onClick={() => handlePlaySong(song)}
                              className={`music-vault-song-item ${isDark ? "theme-dark" : "theme-light"}`}
                            >
                              <div className="music-vault-song-item-left">
                                <span className="music-vault-song-idx">
                                  {idx + 1}
                                </span>

                                <div className="music-vault-song-play">
                                  {playingSongId === song.id ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <h4 className="music-vault-song-title">
                                    {song.title}
                                  </h4>
                                  <p className="music-vault-song-meta">
                                    {song.artist}{" "}
                                    {song.duration ? `• ${song.duration}` : ""}{" "}
                                    {song.genre ? `• ${song.genre}` : ""}
                                  </p>
                                </div>
                              </div>

                              <div className="music-vault-song-actions">
                                <button
                                  onClick={(e) => handleCopySong(song, e)}
                                  className="music-vault-song-action-btn"
                                  title="Copy URL"
                                >
                                  {copiedId === song.id ? (
                                    <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => handleDeleteSong(activeFolder.id, song.id, e)}
                                  className="music-vault-song-action-btn"
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
              <div className={`music-vault-modal-footer ${isDark ? "theme-dark" : "theme-light"}`}>
                <div className="music-vault-modal-footer-left">
                  <span className="music-vault-modal-footer-highlight">
                    <Sparkles className="w-3.5 h-3.5" /> PERSISTED
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    {folders.length} Music Folders • {totalSongsCount} Total Tracks
                  </span>
                </div>

                <div className="music-vault-modal-footer-right">
                  {selectedFolderId !== null && (
                    <button
                      onClick={() => setSelectedFolderId(null)}
                      className="music-vault-btn-secondary"
                    >
                      VIEW ALL FOLDERS
                    </button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="music-vault-btn-primary"
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
