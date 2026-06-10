import { AlertTriangle } from "lucide-react";

export function AIDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      <p>
        AI outputs may be inaccurate or biased. Always review and validate before using for professional
        communication or decisions.
      </p>
    </div>
  );
}
