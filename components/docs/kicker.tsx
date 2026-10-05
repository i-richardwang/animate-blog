// The small accent label above a page title.
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
      <span className="truncate font-medium text-fd-primary">{children}</span>
    </div>
  );
}
