import { useState } from "react";
import {
  Upload,
  Search,
  LayoutGrid,
  List,
  FileText,
  FileSpreadsheet,
  File,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { documents } from "../data/mockData";

type FilterTab = "All" | "Contracts" | "Payslips" | "Policies" | "Reports";
type ViewMode = "list" | "grid";

const FILTER_TABS: FilterTab[] = ["All", "Contracts", "Payslips", "Policies", "Reports"];

const FILE_TYPE_META: Record<string, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  pdf: { icon: FileText, color: "#EF4444", bg: "#FEF2F2", label: "PDF" },
  docx: { icon: FileText, color: "#3B82F6", bg: "#EFF6FF", label: "DOCX" },
  xlsx: { icon: FileSpreadsheet, color: "#10B981", bg: "#ECFDF5", label: "XLSX" },
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Contracts: { bg: "#ECFDF5", color: "#059669" },
  Payslips: { bg: "#EFF6FF", color: "#3B82F6" },
  Policies: { bg: "#FFFBEB", color: "#D97706" },
  Reports: { bg: "#F5F3FF", color: "#7C3AED" },
};

export function Documents() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [docsState, setDocsState] = useState(documents);

  const filtered = docsState.filter((doc) => {
    const matchesTab = activeTab === "All" || doc.category === activeTab;
    const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = (id: string) => setDocsState((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold" style={{ color: "var(--foreground)", fontSize: "22px" }}>
            Document Management
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginTop: "2px" }}>
            Manage contracts, payslips, policies, and company documents.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg,#10B981,#059669)",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
          }}
        >
          <Upload size={15} />
          Upload Document
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FILTER_TABS.slice(1).map((cat) => {
          const count = docsState.filter((d) => d.category === cat).length;
          const meta = CATEGORY_COLORS[cat];
          return (
            <div
              key={cat}
              className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all"
              style={{ background: "var(--card)", border: activeTab === cat ? `1.5px solid #10B981` : "1px solid var(--border)" }}
              onClick={() => setActiveTab(cat)}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: meta.bg }}
              >
                <FolderOpen size={18} color={meta.color} />
              </div>
              <div>
                <p style={{ color: "var(--foreground)", fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>{count}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>{cat}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Controls row ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? "linear-gradient(135deg,#10B981,#059669)" : "var(--card)",
                color: activeTab === tab ? "white" : "var(--muted-foreground)",
                border: activeTab === tab ? "none" : "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="pl-8 pr-4 py-2 rounded-xl outline-none"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "13px", width: "200px" }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#10B981"; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
            />
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <button
              onClick={() => setViewMode("list")}
              className="p-2 transition-colors"
              style={{ background: viewMode === "list" ? "var(--primary)" : "var(--card)", border: "none", cursor: "pointer" }}
            >
              <List size={16} color={viewMode === "list" ? "white" : "var(--muted-foreground)"} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className="p-2 transition-colors"
              style={{ background: viewMode === "grid" ? "var(--primary)" : "var(--card)", border: "none", cursor: "pointer" }}
            >
              <LayoutGrid size={16} color={viewMode === "grid" ? "white" : "var(--muted-foreground)"} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <FolderOpen size={40} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "15px" }}>No documents found</p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "4px" }}>
            {searchQuery ? "Try a different search term." : "Upload your first document to get started."}
          </p>
          {!searchQuery && (
            <button
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold mx-auto"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", border: "none", cursor: "pointer", fontSize: "14px" }}
            >
              <Plus size={15} />
              Upload Document
            </button>
          )}
        </div>
      )}

      {/* ── List View ── */}
      {filtered.length > 0 && viewMode === "list" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {/* Table header */}
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
              borderBottom: "1px solid var(--border)",
              background: "var(--background)",
            }}
          >
            {["Document Name", "Category", "Date", "Size", "Actions"].map((h) => (
              <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {h}
              </span>
            ))}
          </div>

          {filtered.map((doc, i) => {
            const typeMeta = FILE_TYPE_META[doc.type] || { icon: File, color: "#6B7280", bg: "#F3F4F6", label: doc.type.toUpperCase() };
            const catStyle = CATEGORY_COLORS[doc.category] || { bg: "var(--background)", color: "var(--muted-foreground)" };
            const TypeIcon = typeMeta.icon;

            return (
              <div
                key={doc.id}
                className="grid items-center px-5 py-3.5 transition-colors"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 1 ? "var(--background)" : "var(--card)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--muted)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = i % 2 === 1 ? "var(--background)" : "var(--card)"; }}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: typeMeta.bg }}
                  >
                    <TypeIcon size={15} color={typeMeta.color} />
                  </div>
                  <div className="min-w-0">
                    <p
                      style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      title={doc.name}
                    >
                      {doc.name}
                    </p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>
                      by {doc.uploadedBy}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{ background: catStyle.bg, color: catStyle.color }}
                >
                  {doc.category}
                </span>

                {/* Date */}
                <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{doc.date}</span>

                {/* Size */}
                <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{doc.size}</span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {[
                    { icon: Eye, title: "Preview", color: "#6366F1" },
                    { icon: Download, title: "Download", color: "#10B981" },
                    { icon: Trash2, title: "Delete", color: "#EF4444", onClick: () => handleDelete(doc.id) },
                  ].map(({ icon: Icon, title, color, onClick }) => (
                    <button
                      key={title}
                      title={title}
                      onClick={onClick}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}18`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >
                      <Icon size={15} color={color} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Grid View ── */}
      {filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((doc) => {
            const typeMeta = FILE_TYPE_META[doc.type] || { icon: File, color: "#6B7280", bg: "#F3F4F6", label: doc.type.toUpperCase() };
            const catStyle = CATEGORY_COLORS[doc.category] || { bg: "var(--background)", color: "var(--muted-foreground)" };
            const TypeIcon = typeMeta.icon;

            return (
              <div
                key={doc.id}
                className="rounded-2xl p-4 flex flex-col gap-3 transition-all group"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* File icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: typeMeta.bg }}
                >
                  <TypeIcon size={22} color={typeMeta.color} />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {doc.name}
                  </p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "11px", marginTop: "3px" }}>
                    {doc.date} · {doc.size}
                  </p>
                </div>

                {/* Category badge */}
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{ background: catStyle.bg, color: catStyle.color }}
                >
                  {doc.category}
                </span>

                {/* Actions */}
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {[
                    { icon: Eye, title: "Preview", color: "#6366F1" },
                    { icon: Download, title: "Download", color: "#10B981" },
                    { icon: Trash2, title: "Delete", color: "#EF4444", onClick: () => handleDelete(doc.id) },
                  ].map(({ icon: Icon, title, color, onClick }) => (
                    <button
                      key={title}
                      title={title}
                      onClick={onClick}
                      className="flex-1 flex items-center justify-center py-1.5 rounded-lg transition-colors"
                      style={{ background: `${color}12`, border: "none", cursor: "pointer" }}
                    >
                      <Icon size={13} color={color} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
