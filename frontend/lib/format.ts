export function formatMoney(value: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

export function joinPresent(parts: Array<string | null | undefined>, sep = ' ') {
  return parts.filter(p => p && p.trim()).join(sep)
}
