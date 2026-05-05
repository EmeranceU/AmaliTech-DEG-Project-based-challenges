import {
  FileText, FileImage, FileLock2, FileType2, Folder,
  Calendar, HardDrive, Shield, Download, Trash2, Share2,
  Info, Lock, Hash,
} from "lucide-react";

const typeLabel = (type) => {
  switch (type) {
    case "pdf":    return "PDF Document";
    case "doc":    return "Word Document";
    case "txt":    return "Text File";
    case "image":  return "Image";
    case "locked": return "Encrypted File";
    case "folder": return "Folder";
    default:       return "File";
  }
};

const typeBadgeColor = (type) => {
  switch (type) {
    case "pdf":    return "bg-red-500/10 text-red-400 border-red-500/20";
    case "image":  return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "locked": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "folder": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    default:       return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
};

const typeIcon = (type) => {
  switch (type) {
    case "image":  return <FileImage  size={32} className="text-sky-400"    />;
    case "locked": return <FileLock2  size={32} className="text-amber-400"  />;
    case "pdf":    return <FileType2  size={32} className="text-red-400"    />;
    case "folder": return <Folder     size={32} className="text-emerald-400"/>;
    default:       return <FileText   size={32} className="text-blue-400"   />;
  }
};

const actions = [
  { icon: Download, label: "Download", style: "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20" },
  { icon: Share2,   label: "Share",    style: "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20"         },
  { icon: Trash2,   label: "Delete",   style: "text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"          },
];

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

export default function PropertiesPanel({ selected }) {
  const isFolder   = selected?.type === "folder";
  const isRealNode = selected && selected.type !== "nav" && selected.type !== "category";

  return (
    <aside className="w-64 shrink-0 bg-[#0d1117] border-l border-white/[0.06] flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <h2 className="text-xs font-semibold text-white">Properties</h2>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-5">
        {isRealNode ? (
          <>
            <div className="bg-[#161b22] rounded-xl border border-white/[0.06] p-4 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#0d1117] border border-white/[0.06] flex items-center justify-center">
                {typeIcon(selected.type)}
              </div>
              <div className="text-center w-full">
                <p className="text-sm font-semibold text-white truncate px-2">{selected.name}</p>
                <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeBadgeColor(selected.type)}`}>
                  {typeLabel(selected.type)}
                </span>
              </div>
            </div>

            {isFolder ? (
              <div className="bg-[#161b22] rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2 text-gray-500">
                    <HardDrive size={12} />
                    <span className="text-xs">Contents</span>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {selected.children?.length ?? 0} items
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={12} />
                    <span className="text-xs">Modified</span>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {selected.modified ?? "—"}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <SectionLabel>Details</SectionLabel>
                  <div className="bg-[#161b22] rounded-xl border border-white/[0.06] overflow-hidden">
                    {[
                      { icon: FileText,  label: "Type",      value: typeLabel(selected.type)                          },
                      { icon: Lock,      label: "Encrypted", value: selected.type === "locked" ? "AES-256" : "None"   },
                      { icon: Hash,      label: "ID",        value: `#${selected.id}`                                 },
                      { icon: Calendar,  label: "Modified",  value: selected.modified ?? "—"                         },
                      { icon: HardDrive, label: "Size",      value: selected.size ?? "—"                             },
                    ].map(({ icon: Icon, label, value }, i, arr) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between px-3 py-2.5 ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}`}
                      >
                        <div className="flex items-center gap-2 text-gray-500">
                          <Icon size={12} />
                          <span className="text-xs">{label}</span>
                        </div>
                        <span className="text-xs text-gray-300 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel>Actions</SectionLabel>
                  <div className="flex flex-col gap-1.5">
                    {actions.map(({ icon: Icon, label, style }) => (
                      <button
                        key={label}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 w-full border border-transparent ${style}`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {selected.type === "locked" && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex gap-2.5">
                    <Shield size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-400">Encrypted</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">This file is protected with AES-256 encryption.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
            <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-white/[0.06] flex items-center justify-center">
              <Info size={22} className="text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400">No file selected</p>
              <p className="text-xs text-gray-600 mt-1">Click a file or folder to view its properties</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
