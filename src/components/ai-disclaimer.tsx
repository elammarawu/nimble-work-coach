import { ShieldAlert } from "lucide-react";

export function AIDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
        <ShieldAlert className="h-3.5 w-3.5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-foreground">Responsible AI notice</p>
        <p>
          AI outputs may contain mistakes or bias. Always review and validate important information before
          using it for professional communication or decisions.
        </p>
      </div>
    </div>
  );
}
