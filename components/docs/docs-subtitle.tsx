interface DocsSubtitleProps {
  children?: React.ReactNode;
}

export const DocsSubtitle = ({ children }: DocsSubtitleProps) => {
  if (!children) return null;

  return (
    <p className="text-2xl text-muted-foreground/70">{children}</p>
  );
};
