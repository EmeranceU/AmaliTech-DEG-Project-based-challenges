import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ path, onSelect }) {
  if (!path || path.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm mb-5 flex-wrap">
      <span className="flex items-center gap-1">
        <button className="p-1 rounded text-gray-600 hover:text-gray-400 transition-colors">
          <Home size={12} />
        </button>
        <ChevronRight size={11} className="text-gray-700 shrink-0" />
      </span>
      {path.map((node, i) => {
        const isLast = i === path.length - 1;
        return (
          <span key={node.id} className="flex items-center gap-1">
            <button
              onClick={() => onSelect(node)}
              className={`transition-all duration-150 rounded px-1.5 py-0.5 text-xs ${
                isLast
                  ? "text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {node.name}
            </button>
            {!isLast && <ChevronRight size={11} className="text-gray-700 shrink-0" />}
          </span>
        );
      })}
    </nav>
  );
}
