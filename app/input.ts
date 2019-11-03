import { EventEmitter } from './eventEmitter'

export abstract class MyInput<T> {
  public readonly el = document.createElement('input')
  public readonly change = new EventEmitter<T>()

  protected _value: T

  protected constructor(value: T, protected mapper: InputMapper<T> = identityMapper) {
    this._value = value
    if (this.mapper.initInput) this.mapper.initInput(this.el)
  }

  public abstract get value(): T

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

export interface InputMapper<T> {
  affix?: [string, string]

  /** actual value => displayed value */
  display(n: T): T

  /** displayed value => actual value */
  update(n: T): T

  initInput?(input: HTMLInputElement): void
}

const identityMapper: InputMapper<any> = {
  display: (n: any) => n,
  update: (n: any) => n,
}
