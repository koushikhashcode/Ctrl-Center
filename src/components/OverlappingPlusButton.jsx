/**
 * ==========================================
 * COMPONENT: OverlappingPlusButton
 * ==========================================
 * The circular "+" button that opens the Quick Action Menu.
 */
import { Plus } from 'lucide-react';
import './OverlappingPlusButton.css';

export const OverlappingPlusButton = ({ onClick })=>{
    return (
      <div className="overlapping-plus-wrapper">
        <button 
          onClick={onClick} 
          aria-label="Quick Control Action" 
          title="Quick Actions (+)" 
          className="overlapping-plus-btn"
        >
          <Plus className="overlapping-plus-icon" />
        </button>
      </div>
    );
};
