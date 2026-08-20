/**
 * ==========================================
 * COMPONENT: AddPlaylistModal
 * ==========================================
 * Form popup to add a new YouTube playlist.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
export const AddPlaylistModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [videoCount, setVideoCount] = useState("12");
  const [category, setCategory] = useState("Engineering");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      url: url.trim() || "https://youtube.com",
      videoCount: parseInt(videoCount) || 10,
      category: category.trim() || "Dev",
    });
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 12,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="bg-[#FFFFFF] border-4 border-[#171717] rounded-2xl w-full max-w-md shadow-editorial-lg overflow-hidden"
          >
            <div className="bg-[#171717] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#171717]">
              <h3 className="font-heading text-xl font-bold tracking-wider flex items-center gap-2">
                <Play className="w-5 h-5 text-[#F25C23] fill-[#F25C23]" />
                ADD YOUTUBE PLAYLIST
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 font-sans text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1 font-mono uppercase">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design Mastery 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F5F5F3] border-2 border-[#171717] rounded-lg p-2.5 text-[#171717] font-semibold focus:bg-white focus:outline-none focus:border-[#F25C23]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1 font-mono uppercase">
                  YouTube URL
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/playlist?list=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#F5F5F3] border-2 border-[#171717] rounded-lg p-2.5 text-[#171717] font-semibold focus:bg-white focus:outline-none focus:border-[#F25C23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1 font-mono uppercase">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="CS / Dev / Audio"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F5F5F3] border-2 border-[#171717] rounded-lg p-2.5 text-[#171717] font-semibold focus:bg-white focus:outline-none focus:border-[#F25C23]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1 font-mono uppercase">
                    Video Count
                  </label>
                  <input
                    type="number"
                    value={videoCount}
                    onChange={(e) => setVideoCount(e.target.value)}
                    className="w-full bg-[#F5F5F3] border-2 border-[#171717] rounded-lg p-2.5 text-[#171717] font-semibold focus:bg-white focus:outline-none focus:border-[#F25C23]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t-2 border-[#171717] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border-2 border-[#171717] bg-[#F5F5F3] font-heading font-bold rounded-lg cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 border-2 border-[#171717] bg-[#F25C23] text-white font-heading font-bold rounded-lg cursor-pointer shadow-editorial-sm"
                >
                  ADD PLAYLIST
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
