'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import { Kicker } from '@/components/docs/kicker';

// The kicker above a note's title: the separator that groups the page in the
// notes tree — "原型实验" for a page inside a section, "Personal Notes" for a
// section's own landing page.
//
// This replaces the layout's breadcrumb (through `slots.breadcrumb`) rather
// than configuring it: the notes are organised by separators instead of
// nested folders, so the trail is always a single label, and Fumadocs' own
// breadcrumb starts a new scope at each root folder — which would leave the
// three section landing pages without one.
export function SectionLabel() {
  const separator = useTreePath().findLast(
    (node): node is PageTree.Separator => node.type === 'separator',
  );
  if (!separator?.name) return null;

  return <Kicker>{separator.name}</Kicker>;
}
