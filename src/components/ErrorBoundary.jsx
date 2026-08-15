/**
 * ==========================================
 * COMPONENT: ErrorBoundary
 * ==========================================
 * Catches JavaScript errors anywhere in the app and displays a fallback UI instead of crashing.
 */
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
export class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error in component tree:', error, errorInfo);
    }
    handleReload = ()=>{
        window.location.reload();
    };
    handleReset = ()=>{
        this.setState({
            hasError: false,
            error: null
        });
    };
    render() {
        if (this.state.hasError) {
            return <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-4 font-sans selection:bg-[#F25C23] selection:text-white">
          <div className="w-full max-w-lg bg-[#18181B] border-3 border-[#3F3F46] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#171717] relative">
            <div className="flex items-center gap-3 border-b-2 border-[#3F3F46] pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F25C23]/20 border border-[#F25C23] flex items-center justify-center text-[#F25C23]">
                <AlertTriangle className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                  Application Restored
                </h1>
                <p className="font-mono text-xs text-stone-400">
                  A transient UI exception was caught safely.
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-stone-300 mb-6">
              The Digital Control Center prevented a system crash. Your saved data in local storage remains intact.
            </p>

            {this.state.error && <div className="bg-[#121214] border border-[#3F3F46] rounded-xl p-3 mb-6 font-mono text-xs text-red-400 overflow-x-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>}

            <div className="flex items-center gap-3">
              <button onClick={this.handleReset} className="flex-1 px-4 py-2.5 rounded-xl bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#171717] transition-transform active:scale-95">
                <Home className="w-4 h-4"/>
                <span>Try Again</span>
              </button>
              <button onClick={this.handleReload} className="px-4 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-stone-200 font-mono font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-colors">
                <RefreshCw className="w-4 h-4"/>
                <span>Reload App</span>
              </button>
            </div>
          </div>
        </div>;
        }
        return this.props.children;
    }
}
