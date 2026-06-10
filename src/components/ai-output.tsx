import { Copy, Download, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Props {
  content: string;
  loading?: boolean;
  onRegenerate?: () => void;
  filename?: string;
  emptyHint?: string;
}

export function AIOutput({ content, loading, onRegenerate, filename = "output.txt", emptyHint }: Props) {
  function copy() {
    navigator.clipboard.writeText(content);
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
    toast.success("Downloaded");
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">AI Output</h3>
        <div className="flex gap-1">
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading || !content}>
              <RotateCw className="mr-1 h-3.5 w-3.5" /> Regenerate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copy} disabled={!content}>
            <Copy className="mr-1 h-3.5 w-3.5" /> Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={download} disabled={!content}>
            <Download className="mr-1 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
      ) : content ? (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {content}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyHint || "Your AI output will appear here."}</p>
      )}
    </Card>
  );
}
