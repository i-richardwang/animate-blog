import { Kicker } from '@/components/docs/kicker';

const CATEGORY_LABELS = {
  tech: '技术博文',
  humanity: '科技与人文',
};

// The kicker on reading and podcast pages.
export function CategoryLabel({
  category,
}: {
  category: keyof typeof CATEGORY_LABELS;
}) {
  return <Kicker>{CATEGORY_LABELS[category]}</Kicker>;
}
