import { Shield, Bell, Upload, Settings, ChevronRight, Info } from "lucide-react";

export default function Toolbar({ showProperties = true, toggleProperties = () => {} }) {
  return (
    <header className="flex items-center justify-between px-6 h-16 bg-[#0d1117] border-b border-white/[0.06] shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
          <Shield size={16} className="text-emerald-400" />
        </div>
        <div>
          <span className="text-white font-semibold text-sm tracking-wide">SecureVault</span>
          <p className="text-gray-600 text-[10px] leading-none mt-0.5">Enterprise</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-[200px]" />
        <button
          onClick={toggleProperties}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 border border-white/[0.06] ${showProperties ? 'bg-white/[0.03] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}
        >
          <Info size={14} />
          Details
        </button>
      </div>
    </header>
  );
}
