export function formatTokens(value: number): string {
  if (value >= 1_0000_0000)
    return `${(value / 1_0000_0000).toFixed(1)} 亿`;
  if (value >= 1_0000) return `${(value / 1_0000).toFixed(1)} 万`;
  return String(Math.round(value));
}

export function formatCost(value: number): string {
  if (value >= 100) return `$${Math.round(value)}`;
  if (value >= 1) return `$${value.toFixed(1)}`;
  return `$${value.toFixed(2)}`;
}
