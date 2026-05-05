import { Shield, Bell, Upload, Settings, ChevronRight } from "lucide-react";

export default function Toolbar() {
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

      <div className="flex items-center gap-1 min-w-[200px] justify-end">
        <button className="relative p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
          <Upload size={16} />
        </button>
        <button className="relative p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>
        <button className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
          <Settings size={16} />
        </button>
        <div className="ml-2 flex items-center gap-2.5 pl-3 border-l border-white/[0.07]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            AK
          </div>
          <div className="hidden md:block">
            <p className="text-white text-xs font-medium leading-none">Ama Kofi</p>
            <p className="text-gray-600 text-[10px] mt-0.5">Admin</p>
          </div>
          <ChevronRight size={12} className="text-gray-600 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
