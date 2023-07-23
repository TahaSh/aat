export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

export function valueAtPercentage({ from, to, percentage, unit }) {
  return from + (to - from) * percentage + (unit || '')
}
