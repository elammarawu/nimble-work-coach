interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHero({ icon, title, subtitle, badge }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-soft">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "var(--gradient-brand-soft)" }} />
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-40 gradient-bg" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-bg shadow-glow text-white">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          {badge && (
            <span className="mb-2 inline-flex items-center rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-2xl">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
