import { EventEmitter } from './eventEmitter'

export class NumberInput {
  public readonly el = document.createElement('input')
  public readonly change = new EventEmitter<number>()

  private _value: number

  constructor(
    value: number,
    precision: number,
    private mapper = identityMapper,
  ) {
    this._value = value

    const step = (0.1 ** precision * 100_000_000_000) / 100_000_000_000
    this.el.setAttribute('step', '' + step)
    this.el.setAttribute('type', 'number')

    if (this.mapper.initInput) this.mapper.initInput(this.el)

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

  public getLabel(label: string): HTMLLabelElement {
    const el = document.createElement('label')
    const span = document.createElement('span')
    span.innerText = `${label}: `
    el.append(span)

    if (this.mapper.affix != null) {
      const prefix = document.createTextNode(this.mapper.affix[0])
      const suffix = document.createTextNode(this.mapper.affix[1])
      el.append(prefix, this.el, suffix)
    } else {
      el.append(this.el)
    }

    return el
  }
}

export interface InputMapper {
  /** actual value => displayed value */
  display(n: number): number

  /** displayed value => actual value */
  update(n: number): number

  initInput?(input: HTMLInputElement): void
  affix?: [string, string]
}

const identityMapper: InputMapper = {
  display: (n: number) => n,
  update: (n: number) => n,
}

export function mapAtLeast(min: number): InputMapper {
  return {
    display(n: number): number {
      return n
    },

    update(n: number): number {
      return Math.max(n, min)
    },

    initInput(input: HTMLInputElement) {
      input.setAttribute('min', '' + min)
    }
  }
}

export const percentMapper: InputMapper = {
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

  affix: ['', ' %']
}

export const degreeMapper: InputMapper = {
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

  affix: ['', ' °']
}
