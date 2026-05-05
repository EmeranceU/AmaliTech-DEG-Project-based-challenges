import { useRef } from "react";

const NODE_W = 200;
const NODE_H = 80;

const nodeColor = (type) => {
  if (type === "start") return "border-emerald-500/60 bg-emerald-500/10";
  if (type === "end")   return "border-red-500/60 bg-red-500/10";
  return "border-white/15 bg-white/5";
};

const nodeDot = (type) => {
  if (type === "start") return "bg-emerald-400";
  if (type === "end")   return "bg-red-400";
  return "bg-blue-400";
};

function Connectors({ nodes }) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const lines = [];

  for (const node of nodes) {
    for (const opt of node.options) {
      const target = nodeMap[opt.nextId];
      if (!target) continue;
      const x1 = node.position.x + NODE_W / 2;
      const y1 = node.position.y + NODE_H;
      const x2 = target.position.x + NODE_W / 2;
      const y2 = target.position.y;
      const cy = (y1 + y2) / 2;
      lines.push(
        <path
          key={`${node.id}-${opt.nextId}-${opt.label}`}
          d={`M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}`}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
      );
    }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      overflow="visible"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>
      {lines}
    </svg>
  );
}

export default function Canvas({ nodes, selected, onSelect, onMove }) {
  const dragRef = useRef(null);

  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    onSelect(node);
    const offsetX = e.clientX - node.position.x;
    const offsetY = e.clientY - node.position.y;
    dragRef.current = { id: node.id, offsetX, offsetY };

    const handleMove = (me) => {
      if (!dragRef.current) return;
      const x = Math.max(0, me.clientX - dragRef.current.offsetX);
      const y = Math.max(0, me.clientY - dragRef.current.offsetY);
      onMove(dragRef.current.id, { x, y });
    };

    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return (
    <div className="relative w-full h-full overflow-auto bg-[#0a0c10]">
      <div
        className="relative"
        style={{ width: 1400, height: 900 }}
        onClick={() => onSelect(null)}
      >
        <Connectors nodes={nodes} />
        {nodes.map((node) => (
          <div
            key={node.id}
            onMouseDown={(e) => handleMouseDown(e, node)}
            style={{ position: "absolute", left: node.position.x, top: node.position.y, width: NODE_W }}
            className={`rounded-xl border px-4 py-3 cursor-grab active:cursor-grabbing select-none transition-shadow ${nodeColor(node.type)} ${
              selected?.id === node.id ? "ring-2 ring-white/30 shadow-lg shadow-black/40" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${nodeDot(node.type)}`} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">{node.type}</span>
            </div>
            <p className="text-sm text-gray-200 leading-snug line-clamp-2">{node.text}</p>
            {node.options.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {node.options.length} option{node.options.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
