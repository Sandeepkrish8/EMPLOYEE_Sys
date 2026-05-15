import { useState } from "react";
import {
  Rocket,
  Users,
  IndianRupee,
  Calendar,
  BarChart3,
  Settings,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { faqItems, helpCategories } from "../data/mockData";

const iconMap: Record<string, LucideIcon> = {
  Rocket, Users, IndianRupee, Calendar, BarChart3, Settings,
};

type FAQ = { id: string; question: string; answer: string; category: string };

const CATEGORY_FILTERS = ["All", "General", "Employees", "Leave", "Payroll", "Reports", "Departments", "Settings"];

export function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredFaqs: FAQ[] = faqItems.filter((faq) => {
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: string) => setOpenFaqId((prev) => (prev === id ? null : id));

  return (
    <div className="p-6 space-y-8">
      {/* ── Hero Search Banner ── */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: "white" }}
        />

        <div className="relative z-10 max-w-2xl">
          <h1 className="font-bold mb-2" style={{ color: "white", fontSize: "26px" }}>
            How can we help you?
          </h1>
          <p className="mb-6" style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
            Search our knowledge base, browse categories, or contact support.
          </p>

          <div className="relative">
            <Search
              size={18}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles, FAQs..."
              className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
              style={{
                background: "white",
                color: "#111827",
                fontSize: "14px",
                border: "none",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              }}
            />
            {searchQuery && (
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#6B7280" }}>
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Help Categories ── */}
      <div>
        <h2 className="font-bold mb-4" style={{ color: "var(--foreground)", fontSize: "18px" }}>
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Rocket;
            return (
              <button
                key={cat.id}
                onClick={() => { setCategoryFilter(cat.title.split(" ")[0]); setSearchQuery(""); }}
                className="flex items-start gap-4 p-5 rounded-2xl text-left transition-all group"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{ width: "44px", height: "44px", background: cat.bg }}
                >
                  <Icon size={20} color={cat.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 600 }}>{cat.title}</p>
                    <ArrowRight size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>{cat.description}</p>
                  <p style={{ color: cat.color, fontSize: "11px", fontWeight: 600, marginTop: "6px" }}>
                    {cat.count} articles
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ Section ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="font-bold" style={{ color: "var(--foreground)", fontSize: "18px" }}>
            Frequently Asked Questions
          </h2>
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: categoryFilter === cat ? "linear-gradient(135deg,#10B981,#059669)" : "var(--card)",
                  color: categoryFilter === cat ? "white" : "var(--muted-foreground)",
                  border: categoryFilter === cat ? "none" : "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <Search size={32} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "15px" }}>No results found</p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginTop: "4px" }}>
              Try a different search term or browse all categories.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", cursor: "pointer" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq) => {
              const open = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    background: "var(--card)",
                    border: open ? "1.5px solid #10B981" : "1px solid var(--border)",
                    boxShadow: open ? "0 0 0 3px rgba(16,185,129,0.08)" : "none",
                  }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 600, flex: 1, paddingRight: "12px" }}>
                      {faq.question}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "var(--background)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                      >
                        {faq.category}
                      </span>
                      {open ? <ChevronUp size={16} style={{ color: "#10B981" }} /> : <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} />}
                    </div>
                  </button>

                  {open && (
                    <div
                      className="px-5 pb-4"
                      style={{ color: "var(--muted-foreground)", fontSize: "13px", lineHeight: "1.7", borderTop: "1px solid var(--border)" }}
                    >
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Contact Support Card ── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h2 className="font-bold mb-1" style={{ color: "var(--foreground)", fontSize: "17px" }}>
          Still need help?
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "20px" }}>
          Our support team typically responds within 24 hours on business days.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:support@nexushr.com"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg,#10B981,#059669)",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
            }}
          >
            <Mail size={15} />
            Email Support
          </a>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all"
            style={{
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <MessageSquare size={15} />
            Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}
