/**
 * ==========================================
 * COMPONENT: ShortcutBar
 * ==========================================
 * The footer bar showing quick keyboard shortcuts for the user.
 */
import { HelpCircle, Terminal } from 'lucide-react';
import './ShortcutBar.css';

export const ShortcutBar = ({ links = [], onOpenLink, onOpenSearch, onOpenShortcutsModal }) => {
    // Find top links with shortcuts
    const shortcutLinks = links.slice(0, 5);
    return <footer className="shortcut-bar-footer">
      { /* Left: Quick Command Chips */ }
      <div className="shortcut-bar-left">
        <span className="shortcut-bar-hotkeys-label">
          <Terminal className="shortcut-bar-hotkeys-icon"/>
          <span>HOTKEYS:</span>
        </span>

        {shortcutLinks.map((link, i)=><button key={link.id || i} type="button" onClick={()=>onOpenLink && onOpenLink(link)} className="shortcut-bar-chip group" title={`Launch ${link.name}`}>
            <span className="shortcut-bar-chip-text group-hover:text-white">
              {link.name}
            </span>
          </button>)}

        <button type="button" onClick={()=>onOpenSearch && onOpenSearch()} className="shortcut-bar-chip group" title="Global Search Palette">
          <span className="shortcut-bar-chip-text group-hover:text-white">
            Search
          </span>
        </button>
      </div>

      { /* Right: Help trigger */ }
      <button onClick={onOpenShortcutsModal} className="shortcut-bar-right">
        <HelpCircle className="shortcut-bar-help-icon"/>
        <span className="shortcut-bar-help-text">Shortcuts List</span>
      </button>
    </footer>;
};
