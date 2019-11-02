export function byId<T extends HTMLElement>(id: string, klass: new() => T): T {
  const el = document.getElementById(id)
  if (el == null || !(el instanceof klass)) {
    throw new Error(`Expected ${klass.name}, got ${el}`)
  }

  return el
}
