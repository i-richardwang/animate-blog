'use client';

import { motion } from 'motion/react';
import { FooterCredit, StatusLink } from '@/components/footer';
import { rise, useIntroDone } from './intro';

// The home page's footer: one row, the credit at the left and the status
// link at the right, rising in last.
export function HomeFooter() {
  const done = useIntroDone();
  return (
    <motion.footer
      {...rise(4, done)}
      className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground"
    >
      <FooterCredit className="min-w-0" />
      <StatusLink />
    </motion.footer>
  );
}
