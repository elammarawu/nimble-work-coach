import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { History as HistoryIcon, Star, Trash2, Copy, Search, Mail, FileText, ListChecks, Lightbulb, Bot, X } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { loadHistory, toggleFavorite, deleteHistory, clearHistory, type HistoryItem } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

const FEATURE_META: Record<HistoryItem["feature"], { label: string; icon: typeof Mail; color: string }> = {
  email: { label: "Email", icon: Mail, color: "from-blue-500 to-cyan-500" },
  meeting: { label: "Meeting", icon: FileText, color: "from-violet-500 to-fuchsia-500" },
  tasks: { label: "Tasks", icon: ListChecks, color: "from-emerald-500 to-teal-500" },
  research: { label: "Research", icon: Lightbulb, color: "from-amber-500 to-orange-500" },
  chat: { label: "Chat", icon: Bot, color: "from-pink-500 to-rose-500" },
};

const FILTERS = ["all", "favorites", "email", "meeting", "tasks", "research", "chat"] as const;
type Filter = (typeof FILTERS)[number];

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<HistoryItem[]>([]); // for compare (max 2)
  const [active, setActive] = useState<HistoryItem | null>(null);

  function refresh() { setItems(loadHistory()); }
  useEffect(refresh, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter === "favorites" && !i.favorite) return false;
      if (filter !== "all" && filter !== "favorites" && i.feature !== filter) return false;
      if (q && !(i.title.toLowerCase().includes(q) || i.output.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [items, query, filter]);

  function onFav(id: string) { toggleFavorite(id); refresh(); }
  function onDel(id: string) {
    deleteHistory(id);
    setSelected((s) => s.filter((x) => x.id !== id));
    refresh();
    toast.success("Deleted");
  }
  function onClear() {
    if (!confirm("Clear all history? This cannot be undone.")) return;
    clearHistory(); setSelected([]); setActive(null); refresh();
    toast.success("History cleared");
  }
  function toggleCompare(item: HistoryItem) {
    setSelected((s) => {
      if (s.find((x) => x.id === item.id)) return s.filter((x) => x.id !== item.id);
      if (s.length >= 2) return [s[1], item];
      return [...s, item];
    });
  }
  function copy(text: string) {
    navigator.clipboard.writeText(text); toast.success("Copied");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <PageHero
        icon={<HistoryIcon className="h-6 w-6" />}
        title="History & Favorites"
        subtitle="Revisit, compare, and re-use any AI output you've generated. Stored locally in your browser."
        badge="Local"
      />

      {/* Controls */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or output…"
              className="w-full rounded-full border border-border bg-background/60 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" onClick={onClear} disabled={items.length === 0} className="rounded-full">
            <Trash2 className="mr-2 h-4 w-4" /> Clear all
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "border-transparent gradient-bg text-white shadow-glow"
                  : "border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
            <span className="font-medium">Compare ({selected.length}/2):</span>
            {selected.map((s) => (
              <span key={s.id} className="rounded-full bg-background px-2 py-0.5">{s.title.slice(0, 30)}</span>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setSelected([])} className="ml-auto h-6 rounded-full">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Compare view */}
      {selected.length === 2 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {selected.map((s) => (
            <CompareCard key={s.id} item={s} onCopy={copy} />
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg-soft">
            <HistoryIcon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium">No history yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {items.length === 0 ? "Generate something with any AI tool to see it here." : "No items match your filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => {
            const meta = FEATURE_META[item.feature];
            const isSelected = !!selected.find((x) => x.id === item.id);
            const Icon = meta.icon;
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-soft transition-all card-hover ${
                  isSelected ? "border-primary shadow-glow" : "border-border/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{item.title}</p>
                      {item.favorite && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {meta.label} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.output}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setActive(item)} className="h-7 rounded-full text-xs">View</Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleCompare(item)} className="h-7 rounded-full text-xs">
                    {isSelected ? "Unpick" : "Compare"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => copy(item.output)} className="h-7 rounded-full text-xs">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onFav(item.id)} className="h-7 rounded-full text-xs">
                    <Star className={`h-3.5 w-3.5 ${item.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDel(item.id)} className="ml-auto h-7 rounded-full text-xs text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{active.title}</p>
                <p className="text-[11px] capitalize text-muted-foreground">
                  {active.feature} · {new Date(active.createdAt).toLocaleString()}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActive(null)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Input</p>
              <pre className="mb-4 whitespace-pre-wrap rounded-xl bg-muted/40 p-3 font-sans text-xs text-muted-foreground">{active.input}</pre>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Output</p>
              <pre className="whitespace-pre-wrap rounded-xl bg-muted/40 p-3 font-sans text-sm leading-relaxed">{active.output}</pre>
            </div>
            <div className="flex justify-end gap-2 border-t border-border/60 px-5 py-3">
              <Button variant="outline" onClick={() => copy(active.output)} className="rounded-full">
                <Copy className="mr-2 h-3.5 w-3.5" /> Copy output
              </Button>
              <Button onClick={() => { onFav(active.id); setActive({ ...active, favorite: !active.favorite }); }} className="gradient-bg rounded-full text-white border-0">
                <Star className={`mr-2 h-3.5 w-3.5 ${active.favorite ? "fill-white" : ""}`} />
                {active.favorite ? "Unfavorite" : "Favorite"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareCard({ item, onCopy }: { item: HistoryItem; onCopy: (t: string) => void }) {
  const meta = FEATURE_META[item.feature];
  const Icon = meta.icon;
  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${meta.color} text-white`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <p className="truncate text-sm font-semibold">{item.title}</p>
        <Button size="sm" variant="ghost" onClick={() => onCopy(item.output)} className="ml-auto h-7 rounded-full text-xs">
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <pre className="max-h-[400px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-muted/30 p-3 font-sans text-xs leading-relaxed">{item.output}</pre>
    </div>
  );
}
