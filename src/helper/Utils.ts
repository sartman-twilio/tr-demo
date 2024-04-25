export class Lazy<T> {
  private value: T | null = null

  constructor(private supplier: () => T) {
  }

  public get(): T {
    if (!this.value) {
      this.value = this.supplier()
    }
    return this.value
  }
}

export class LateInit<T> {
  private value: T | null = null
  private readonly errorSupplier = () => new Error('Accessing late init value before it was initialized')

  constructor(errorSupplier?: () => Error) {
    if (errorSupplier) {
      this.errorSupplier = errorSupplier
    }
  }

  public set(t: T) {
    if (!this.value) {
      this.value = t
    } else {
      throw new Error('Reinitializing late init value')
    }
  }

  public get(): T {
    if (this.value) {
      return this.value
    } else {
      throw this.errorSupplier()
    }
  }
}

export function lateInitOf<T>(value: T): LateInit<T> {
  let result = new LateInit<T>()
  result.set(value)
  return result
}

export function TODO(): never {
  throw new Error('Not implemented')
}

export function sortedByStringAttribute<T>(arr: ReadonlyArray<T>, attribute: (obj: T) => string): Array<T> {
  return arr.slice().sort(function (a, b) {
    return ('' + attribute(a)).localeCompare(attribute(b))
  })
}

export function compute<K, V>(map: Map<K, V>, key: K, fn: (k: K, v?: V) => V): void {
  map.set(key, fn(key, map.get(key)))
}