import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  FileImage,
  FileLock2,
  FileType2,
  ChevronRight,
  HardDrive,
  Star,
  Trash2,
  LayoutDashboard,
  Share2,
  Clock,
  ImageIcon,
  FolderOpen as ProjectsIcon,
} from "lucide-react";
import tree from "../../data/data.json";

const fileIcon = (type) => {
  switch (type) {
    case "image":  return <FileImage  size={15} className="text-sky-400"   />;
    case "locked": return <FileLock2  size={15} className="text-amber-400" />;
    case "pdf":    return <FileType2  size={15} className="text-red-400"   />;
    case "txt":    return <FileText   size={15} className="text-gray-400"  />;
    default:       return <FileText   size={15} className="text-blue-400"  />;
  }
};

function flatten(nodes, openIds) {
  const result = [];
  for (const node of nodes) {
    result.push(node);
    if (node.type === "folder" && openIds.has(node.id) && node.children) {
      result.push(...flatten(node.children, openIds));
    }
  }
  return result;
}

function TreeNode({ node, depth = 0, selected, onSelect, openIds, onToggle, focusedId, nodeRefs, matchedIds }) {
  const isFolder   = node.type === "folder";
  const isOpen     = openIds.has(node.id);
  const isSelected = selected?.id === node.id;
  const isFocused  = focusedId === node.id;
  const isDimmed   = matchedIds && !matchedIds.has(node.id);

  const handleClick = () => {
    if (isFolder) onToggle(node.id);
    onSelect(node);
  };

  return (
    <div>
      <button
        ref={(el) => { if (el) nodeRefs.current[node.id] = el; }}
        onClick={handleClick}
        style={{ paddingLeft: `${10 + depth * 14}px` }}
        className={`flex items-center gap-2 w-full pr-2 py-1.5 text-sm rounded-lg transition-all duration-150 outline-none ${isDimmed ? "opacity-30" : ""} ${
          isSelected && !isFocused
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            : isFocused
            ? "bg-sky-500/10 text-sky-300 border border-sky-500/30"
            : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 border border-transparent"
        }`}
      >
        {isFolder ? (
          <>
            <ChevronRight
              size={12}
              className={`text-gray-600 transition-transform duration-150 shrink-0 ${isOpen ? "rotate-90" : ""}`}
            />
            {isOpen
              ? <FolderOpen size={14} className="text-pink-400 shrink-0" />
              : <Folder     size={14} className="text-emerald-500/70 shrink-0" />
            }
          </>
        ) : (
          <span className="ml-[16px] shrink-0">{fileIcon(node.type)}</span>
        )}
        <span className="truncate text-xs">{node.name}</span>
      </button>

      {isFolder && isOpen && node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selected={selected}
          onSelect={onSelect}
          openIds={openIds}
          onToggle={onToggle}
          focusedId={focusedId}
          nodeRefs={nodeRefs}
          matchedIds={matchedIds}
        />
      ))}
    </div>
  );
}

const navItems = [
  { id: "nav-allfiles", icon: HardDrive, label: "All Files" },
];



export default function FileExplorer({ selected, onSelect, matchedIds, expandIds }) {
  const [openIds,      setOpenIds]      = useState(new Set());
  const [focusedIndex, setFocusedIndex] = useState(null);
  const nodeRefs = useRef({});

  const effectiveOpenIds = useMemo(() => {
    if (!expandIds) return openIds;
    const merged = new Set(openIds);
    expandIds.forEach((id) => merged.add(id));
    return merged;
  }, [openIds, expandIds]);

  const toggleOpen = useCallback((id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const treeNodes = flatten(tree, effectiveOpenIds);

  const allItems = [
    ...navItems.map(({ id, label }) => ({ id, name: label, type: "nav" })),
    ...treeNodes,
  ];

  const handleKeyDown = (e) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) return;
    e.preventDefault();

    const current = focusedIndex ?? -1;
    const node    = allItems[current];

    if (e.key === "ArrowDown") {
      setFocusedIndex(Math.min(current + 1, allItems.length - 1));
    }

    if (e.key === "ArrowUp") {
      setFocusedIndex(Math.max(current <= 0 ? 0 : current - 1, 0));
    }

    if (e.key === "ArrowRight" && node?.type === "folder") {
      if (!effectiveOpenIds.has(node.id)) {
        toggleOpen(node.id);
      } else if (node.children?.length) {
        const firstChildIndex = allItems.findIndex((n) => n.id === node.children[0].id);
        if (firstChildIndex !== -1) setFocusedIndex(firstChildIndex);
      }
    }

    if (e.key === "ArrowLeft" && node?.type === "folder") {
      if (effectiveOpenIds.has(node.id)) {
        toggleOpen(node.id);
      } else {
        const parentIndex = allItems.findIndex((n) =>
          n.type === "folder" && n.children?.some((c) => c.id === node.id)
        );
        if (parentIndex !== -1) setFocusedIndex(parentIndex);
      }
    }

    if (e.key === "Enter" && node) {
      onSelect(node);
      if (node.type === "folder") toggleOpen(node.id);
    }
  };

  useEffect(() => {
    if (focusedIndex === null) return;
    const node = allItems[focusedIndex];
    if (node && nodeRefs.current[node.id]) {
      nodeRefs.current[node.id].scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, openIds]);

  const focusedId = allItems[focusedIndex]?.id;

  return (
    <aside
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => { if (focusedIndex === null) setFocusedIndex(0); }}
      className="w-64 shrink-0 bg-[#0d1117] border-r border-white/[0.06] flex flex-col overflow-y-auto outline-none"
    >
      <div className="flex-1 px-3 py-4 flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1.5 px-2">
            Explorer
          </p>
          <div className="flex flex-col gap-0.5">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive  = selected?.id === id;
              const isFocused = focusedId === id;
              return (
                <button
                  key={id}
                  ref={(el) => { if (el) nodeRefs.current[id] = el; }}
                  onClick={() => onSelect({ id, name: label, type: "nav" })}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 outline-none ${
                    isFocused
                      ? "bg-sky-500/10 text-sky-300 border border-sky-500/30"
                      : isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300 border border-transparent"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="text-xs font-medium">{label}</span>
                  {isActive && !isFocused && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}

            <div className="mt-2">
              <div className="flex flex-col gap-0.5">
                {tree.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    selected={selected}
                    onSelect={onSelect}
                    openIds={effectiveOpenIds}
                    onToggle={toggleOpen}
                    focusedId={focusedId}
                    nodeRefs={nodeRefs}
                    matchedIds={matchedIds}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </aside>
  );
}
