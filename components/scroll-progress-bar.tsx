'use client';

import {
  ScrollProgressProvider,
  ScrollProgress,
} from '@/registry/primitives/animate/scroll-progress';

export const ScrollProgressBar = () => {
  return (
    <ScrollProgressProvider global direction="vertical">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ScrollProgress className="h-1 bg-foreground" />
      </div>
    </ScrollProgressProvider>
  );
};

