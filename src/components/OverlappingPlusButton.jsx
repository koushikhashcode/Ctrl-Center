/**
 * ==========================================
 * COMPONENT: OverlappingPlusButton
 * ==========================================
 * The circular "+" button that opens the Quick Action Menu.
 */
import { Plus } from 'lucide-react';
export const OverlappingPlusButton = ({ onClick })=>{
    return <div className="absolute top-1/2 -right-5 -translate-y-1/2 z-30 hidden lg:block">
      <button onClick={onClick} aria-label="Quick Control Action" title="Quick Actions (+)" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFFFF] hover:bg-[#F25C23] text-[#171717] hover:text-white border-3 border-[#171717] shadow-editorial-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 active:scale-95 group">
        <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300"/>
      </button>
    </div>;
};
