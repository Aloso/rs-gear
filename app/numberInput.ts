import { InputMapper, MyInput } from './input'

export class NumberInput extends MyInput<number> {
  constructor(value: number, precision: number, mapper?: InputMapper<number>) {
    super(value, mapper)

    const step = (0.1 ** precision * 100_000_000 | 0) / 100_000_000
    this.el.setAttribute('type', 'number')
    this.el.setAttribute('step', '' + step)

    this.el.value = '' + this.mapper.display(value)

    this.el.addEventListener('input', () => {
      const v = +this.el.value
      if (isNaN(v)) return
      this.value = this.mapper.update(v)
    })
  }

  public get value(): number {
    return this._value
  }

  public set value(v: number) {
    if (v !== this._value) {
      this._value = v
      this.el.value = '' + this.mapper.display(v)
      this.change.emit(v)
    }
  }
}

export interface NumInputMapper {
  affix?: [string, string]

  /** actual value => displayed value */
  display(n: number): number

  /** displayed value => actual value */
  update(n: number): number

  initInput?(input: HTMLInputElement): void
}

export function mapAtLeast(min: number): NumInputMapper {
  return {
    display(n: number): number {
      return n
    },

    update(n: number): number {
      return Math.max(n, min)
    },

    initInput(input: HTMLInputElement) {
      input.setAttribute('min', '' + min)
    },
  }
}

export const percentMapper: NumInputMapper = {
  affix: ['', ' %'],

  display(n: number): number {
    return n * 100
  },

  update(n: number): number {
    return Math.min(Math.max(n, 0), 100) / 100
  },

  initInput(input: HTMLInputElement) {
    input.setAttribute('min', '0')
    input.setAttribute('max', '100')
  },
}

export const openPercentMapper: NumInputMapper = {
  affix: ['', ' %'],

  display(n: number): number {
    return n * 100
  },

  update(n: number): number {
    return n / 100
  },
}

export const degreeMapper: NumInputMapper = {
  affix: ['', ' °'],

  display(n: number): number {
    return n * 360
  },

  update(n: number): number {
    return Math.min(Math.max(n, 0), 360) / 360
  },

  initInput(input: HTMLInputElement) {
    input.setAttribute('min', '0')
    input.setAttribute('max', '360')
  },
}
