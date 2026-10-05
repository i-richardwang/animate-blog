const CATEGORY_LABELS = {
  tech: '技术博文',
  humanity: '科技与人文',
};

export const CategoryBreadcrumb = ({
  category,
}: {
  category: keyof typeof CATEGORY_LABELS;
}) => {
  return (
    <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
      <span className="truncate text-fd-primary font-medium">
        {CATEGORY_LABELS[category]}
      </span>
    </div>
  );
};
