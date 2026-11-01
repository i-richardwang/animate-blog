'use client';

import { useEffect, useRef, useState } from 'react';

const COPIED_MS = 2000;

// Writes text to the clipboard; `copied` is true for a moment afterwards,
// long enough for a button to show a tick.
export function useCopied() {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return { copied, copy };
}
