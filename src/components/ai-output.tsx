import { Copy, Download, RotateCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  content: string;
  loading?: boolean;
  onRegenerate?: () => void;
  filename?: string;
  emptyHint?: string;
  emptyIcon?: React.ReactNode;
}

export function AIOutput({ content, loading, onRegenerate, filename = "output.txt", emptyHint, emptyIcon }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Copied to clipboard");
  }
  function download() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full gradient-bg" />
          <h3 className="text-sm font-semibold">AI Response</h3>
        </div>
        <div className="flex gap-1">
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading || !content} className="h-8 rounded-full">
              <RotateCw className="mr-1 h-3.5 w-3.5" /> Regenerate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copy} disabled={!content} className="h-8 rounded-full">
            {copied ? <Check className="mr-1 h-3.5 w-3.5 text-green-500" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={download} disabled={!content} className="h-8 rounded-full">
            <Download className="mr-1 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>
      <div className="p-5 min-h-[260px]">
        {loading ? (
          <div className="space-y-2.5">
            <div className="h-3 w-3/4 rounded animate-shimmer" />
            <div className="h-3 w-full rounded animate-shimmer" />
            <div className="h-3 w-5/6 rounded animate-shimmer" />
            <div className="h-3 w-2/3 rounded animate-shimmer" />
          </div>
        ) : content ? (
          <pre className="animate-fade-in whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
            {content}
          </pre>
        ) : (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg-soft">
              {emptyIcon}
            </div>
            <p className="text-sm text-muted-foreground">{emptyHint || "Your AI output will appear here."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
