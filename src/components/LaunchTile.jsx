/**
 * ==========================================
 * COMPONENT: LaunchTile
 * ==========================================
 * An individual clickable square app icon inside the QuickLaunch box.
 */
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrandIcon } from './BrandIcon';
import { MoreVertical, Trash2, Edit2, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './LaunchTile.css';
export const LaunchTile = ({ link, onOpenLink, onEditLink, onDeleteLink })=>{
    const [showOptions, setShowOptions] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const { isDark } = useTheme();
    const tileRef = useRef(null);
    useEffect(()=>{
        if (!showOptions) return;
        const handleClickOutside = (event)=>{
            if (tileRef.current && !tileRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [
        showOptions
    ]);
    const handleCopyLink = (e)=>{
        e.stopPropagation();
        if (link.url) {
            navigator.clipboard.writeText(link.url);
            setCopied(true);
            setTimeout(()=>setCopied(false), 2000);
        }
    };
    return (
      <div className="launch-tile-container" ref={tileRef}>
        <motion.button
          onClick={() => {
            if (showOptions) {
              setShowOptions(false);
              return;
            }
            onOpenLink(link);
          }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className={`launch-tile-btn ${isDark ? 'theme-dark' : 'theme-light'}`}
        >
          {/* Shortcut Badge at Top Left */}
          {link.shortcutKey && (
            <span className="launch-tile-shortcut">
              ⌘{link.shortcutKey}
            </span>
          )}

          {/* Copy Link Trigger at Bottom Left */}
          <div
            onClick={handleCopyLink}
            className="launch-tile-action-icon launch-tile-action-icon-bl"
            title={copied ? "Copied Link!" : "Copy Link"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </div>

          {/* Options trigger */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="launch-tile-action-icon launch-tile-action-icon-tr"
            title="Tile Options"
          >
            <MoreVertical className="w-4 h-4" />
          </div>

          {/* Center Logo */}
          <div className="launch-tile-icon-container">
            <div className="launch-tile-icon-wrapper">
              <BrandIcon name={link.iconName || link.name} className="brand-icon-default sm:w-9 sm:h-9" />
            </div>
          </div>

          {/* Bottom Label */}
          <div className="launch-tile-label-container">
            <span className="launch-tile-label">
              {link.name}
            </span>
          </div>
        </motion.button>

        {/* Invisible backdrop to capture outside clicks immediately */}
        {showOptions && (
          <div
            className="launch-tile-backdrop"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(false);
            }}
          />
        )}

        {/* Options Dropdown */}
        {showOptions && (
          <div
            onMouseLeave={() => setShowOptions(false)}
            className={`launch-tile-dropdown ${isDark ? 'theme-dark' : 'theme-light'}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(false);
                onEditLink(link);
              }}
              className="launch-tile-dropdown-btn"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Link
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(false);
                onDeleteLink(link.id);
              }}
              className="launch-tile-dropdown-btn danger"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    );
};
