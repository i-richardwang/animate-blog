'use client';

// An icon button that flips between light and dark: the sun turns into the
// moon with a short spin, scale and blur (Animate UI's Theme Toggler). Until
// hydration the theme is unknown, so a plain button shows the icon CSS picks.

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import {
  ThemeTogglerButton,
  ThemeTogglerButtonIcon,
  type Resolved,
  type ThemeSelection,
} from '@/components/animate-ui/buttons/theme-toggler';
import { cn } from '@/lib/utils';

export const iconButton =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground';

const subscribeNever = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  if (!hydrated)
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(iconButton, className)}
      >
        <Sun className="size-[18px] dark:hidden" />
        <Moon className="hidden size-[18px] dark:block" />
      </button>
    );

  return (
    <ThemeTogglerButton
      theme={(theme ?? 'system') as ThemeSelection}
      resolvedTheme={(resolvedTheme ?? 'light') as Resolved}
      setTheme={setTheme}
      modes={['light', 'dark']}
      aria-label="Toggle theme"
      variant={null}
      size={null}
      className={cn(iconButton, className)}
    >
      <ThemeTogglerButtonIcon
        light={<Sun className="size-[18px]" />}
        dark={<Moon className="size-[18px]" />}
      />
    </ThemeTogglerButton>
  );
}
