const CATEGORY_LABELS: Record<string, string> = {
  // Reading categories
  tech: '技术博文',
  humanity: '科技与人文',
  // Podcast categories
  business: '商业洞察',
  other: '其他',
};

export const CategoryBreadcrumb = ({
  category,
}: {
  category?: string;
}) => {
  if (!category) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
      <span className="truncate text-fd-primary font-medium">
        {CATEGORY_LABELS[category] ?? category}
      </span>
    </div>
  );
};
