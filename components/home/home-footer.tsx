'use client';

import { motion } from 'motion/react';
import { FooterCredit, StatusLink } from '@/components/footer';
import { rise } from '@/lib/motion';
import { useIntroDone } from './intro';

// The home page's footer: one row, the credit at the left and the status
// link at the right, rising in last, as the fourth card lands.
export function HomeFooter() {
  const done = useIntroDone();
  return (
    <motion.footer
      {...rise(6, { shown: done })}
      className="page-frame flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground"
    >
      <FooterCredit className="min-w-0" />
      <StatusLink />
    </motion.footer>
  );
}
