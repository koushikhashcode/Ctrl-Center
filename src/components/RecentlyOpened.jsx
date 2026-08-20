/**
 * ==========================================
 * COMPONENT: RecentlyOpened
 * ==========================================
 * Shows a history of recently opened links, tools, and documents.
 */
import { Clock, FileText, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './RecentlyOpened.css';

export const RecentlyOpened = ({ items, onOpenItem, onClearHistory }) => {
    const { isDark } = useTheme();
    return <div className={`recently-opened-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      { /* Header */ }
      <div>
        <div className={`recently-opened-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <div className="recently-opened-title-container">
            <div className="recently-opened-icon-wrapper">
              <Clock className="w-5 h-5 text-[#F25C23]"/>
            </div>
            <h2 className={`recently-opened-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
              RECENTLY OPENED
            </h2>
          </div>

          {onClearHistory && <button onClick={onClearHistory} className={`recently-opened-clear-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
              CLEAR HISTORY
            </button>}
        </div>

        { /* Rows */ }
        <div className="recently-opened-list">
          {items.length === 0 ? <div className={`recently-opened-empty ${isDark ? 'theme-dark' : 'theme-light'}`}>
              No recent items launched yet.
            </div> : items.slice(0, 4).map((item)=><div key={item.id} onClick={()=>onOpenItem(item)} className={`recently-opened-item ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <div className="recently-opened-item-left">
                  <div className="recently-opened-item-icon">
                    <FileText className="w-3.5 h-3.5"/>
                  </div>
                  <div className="recently-opened-item-text">
                    <span className="recently-opened-item-title">
                      {item.title}
                    </span>
                    <span className="recently-opened-item-subtitle">
                      {item.category || 'General'} {item.fileSize ? `• ${item.fileSize}` : ''}
                    </span>
                  </div>
                </div>

                <div className="recently-opened-item-right">
                  <span className="recently-opened-item-time">
                    {item.timestamp}
                  </span>
                  <ExternalLink className="recently-opened-item-ext-icon"/>
                </div>
              </div>)}
        </div>
      </div>

      { /* Footer info */ }
      <div className={`recently-opened-footer ${isDark ? 'theme-dark' : 'theme-light'}`}>
        <span>AUTO-TRACKING ACTIVE</span>
        <span className="recently-opened-footer-highlight">⌘K READY</span>
      </div>
    </div>;
};
