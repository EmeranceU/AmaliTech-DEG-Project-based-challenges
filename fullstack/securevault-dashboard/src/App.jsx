import { useState, useMemo } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import FileExplorer from "./components/Explorer/FileExplorer";
import PropertiesPanel from "./components/PropertiesPanel/PropertiesPanel";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";
import { findPath } from "./utils/findPath";
import { useSearch } from "./hooks/useSearch";
import {
  FileText, FileLock2, FileImage, FileType2, Folder,
  LayoutGrid, List, SlidersHorizontal, AlertTriangle,
  RefreshCw, Sparkles, MoreHorizontal, Download, Share2, Search, X,
} from "lucide-react";
import tree from "./data/data.json";

const nodeIcon = (type) => {
  switch (type) {
    case "folder": return <Folder    size={16} className="text-emerald-400" />;
    case "image":  return <FileImage  size={16} className="text-sky-400"    />;
    case "locked": return <FileLock2  size={16} className="text-amber-400"  />;
    case "pdf":    return <FileType2  size={16} className="text-red-400"    />;
    default:       return <FileText   size={16} className="text-blue-400"   />;
  }
};

const typeBadge = (type) => {
  const map = {
    folder: "bg-emerald-500/10 text-emerald-400",
    image:  "bg-sky-500/10 text-sky-400",
    locked: "bg-amber-500/10 text-amber-400",
    pdf:    "bg-red-500/10 text-red-400",
    doc:    "bg-blue-500/10 text-blue-400",
    txt:    "bg-gray-500/10 text-gray-400",
  };
  return map[type] ?? "bg-gray-500/10 text-gray-400";
};

const resolveItems = (selected) => {
  if (!selected)                              return tree;
  if (selected.id === "nav-allfiles")         return tree;
  if (selected.type === "nav")                return null;
  if (selected.type === "category")           return null;
  if (selected.type === "folder")             return selected.children ?? [];
  return [selected];
};

const dashboardCards = [
  {
    icon: Sparkles,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    title: "Suggested",
    subtitle: "Project Proposal.pdf",
    tag: "New",
    tagColor: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: RefreshCw,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "Recent Sync",
    subtitle: "4 files updated",
    tag: "Just now",
    tagColor: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    title: "Security Alert",
    subtitle: "2 suspicious logins",
    tag: "Action needed",
    tagColor: "bg-red-500/10 text-red-400",
  },
];

function DashboardCards() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {dashboardCards.map(({ icon: Icon, color, bg, border, title, subtitle, tag, tagColor }) => (
        <div
          key={title}
          className={`bg-[#161b22] rounded-xl border ${border} p-4 flex gap-3 items-start hover:bg-[#1c2128] transition-all duration-150 cursor-pointer`}
        >
          <div className={`${bg} p-2 rounded-lg shrink-0`}>
            <Icon size={15} className={color} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">{title}</p>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{subtitle}</p>
            <span className={`inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${tagColor}`}>
              {tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FileTable({ items, onSelect, selected }) {
  return (
    <div className="bg-[#161b22] rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="grid grid-cols-[auto_2fr_1fr_1fr_auto] items-center px-4 py-2.5 border-b border-white/[0.06] gap-3">
        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-emerald-500 opacity-40" readOnly />
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Name</span>
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Modified</span>
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Size</span>
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Actions</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Folder size={28} className="text-gray-700" />
          <p className="text-sm text-gray-600">This folder is empty</p>
        </div>
      ) : (
        items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`grid grid-cols-[auto_2fr_1fr_1fr_auto] items-center px-4 py-3 gap-3 cursor-pointer transition-all duration-150 group ${
              selected?.id === item.id
                ? "bg-emerald-500/5 border-l-2 border-emerald-500"
                : `hover:bg-white/[0.03] ${i < items.length - 1 ? "border-b border-white/[0.04]" : ""}`
            }`}
          >
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded accent-emerald-500 opacity-0 group-hover:opacity-60 transition-opacity"
              readOnly
              checked={selected?.id === item.id}
            />
            <div className="flex items-center gap-2.5 min-w-0">
              {nodeIcon(item.type)}
              <div className="min-w-0">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors truncate font-medium">
                  {item.name}
                </p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${typeBadge(item.type)}`}>
                  {item.type}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600">{item.modified ?? "—"}</span>
            <span className="text-xs text-gray-600">
              {item.type === "folder" ? `${item.children?.length ?? 0} items` : "—"}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <Download size={13} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <Share2 size={13} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <MoreHorizontal size={13} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 h-full min-h-[300px]">
      <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-white/[0.06] flex items-center justify-center">
        <Folder size={24} className="text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function flattenAll(nodes) {
  const result = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children) result.push(...flattenAll(node.children));
  }
  return result;
}

function MainContent({ selected, onSelect, query, setQuery, matchedIds }) {
  const [view, setView] = useState("list");
  const path = selected && !query ? findPath(tree, selected.id) : null;

  const items = useMemo(() => {
    if (query && matchedIds) {
      return flattenAll(tree).filter((n) => matchedIds.has(n.id));
    }
    return resolveItems(selected);
  }, [query, matchedIds, selected]);

  const isEmpty = items === null || items.length === 0;

  return (
    <main className="flex-1 overflow-y-auto bg-[#0f1117] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          {path ? (
            <Breadcrumb path={path} onSelect={onSelect} />
          ) : (
            <>
              <h1 className="text-base font-semibold text-white">
                {query ? `Results for "${query}"` : selected?.name ?? "All Files"}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                {items ? `${items.length} items` : ""}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#161b22] border border-white/[0.06] rounded-lg px-3 py-1.5">
            <Search size={12} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files..."
              className="bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none w-36"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-gray-600 hover:text-gray-400 transition-colors">
                <X size={11} />
              </button>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-all duration-150">
            <SlidersHorizontal size={12} />
            Filter
          </button>
          <div className="flex items-center bg-[#161b22] border border-white/[0.06] rounded-lg p-0.5">
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-all duration-150 ${view === "list" ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-all duration-150 ${view === "grid" ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {selected?.id === "nav-dashboard" && !query && <DashboardCards />}

      {path && items && items.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white">{selected?.name}</h2>
          <p className="text-xs text-gray-600 mt-0.5">{items.length} items</p>
        </div>
      )}

      {isEmpty ? (
        <EmptyState
          title={query ? `No results for "${query}"` : selected ? `${selected.name} is empty` : "Nothing here"}
          subtitle={query ? "Try a different search term" : "No files or folders to display"}
        />
      ) : (
        <FileTable items={items} onSelect={onSelect} selected={selected} />
      )}
    </main>
  );
}

export default function App() {
  const [selected, setSelected] = useState({ id: "nav-dashboard", name: "Dashboard", type: "nav" });
  const { query, setQuery, matchedIds, expandIds } = useSearch(tree);

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-gray-100 overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          onSelect={setSelected}
          selected={selected}
          matchedIds={matchedIds}
          expandIds={expandIds}
        />
        <MainContent
          selected={selected}
          onSelect={setSelected}
          query={query}
          setQuery={setQuery}
          matchedIds={matchedIds}
        />
        <PropertiesPanel selected={selected} />
      </div>
    </div>
  );
}
