import { InputMapper, MyInput } from './input'

export class CheckInput extends MyInput<boolean> {
  constructor(value: boolean, mapper?: InputMapper<boolean>) {
    super(value, mapper)

    this.el.setAttribute('type', 'checkbox')

    this.el.checked = value

    this.el.addEventListener('input', () => {
      const v = this.el.checked
      this.value = this.mapper.update(v)
    })
  }

  public get value(): boolean {
    return this._value
  }

  public set value(v: boolean) {
    if (v !== this._value) {
      this._value = v
      this.el.checked = v
      this.change.emit(v)
    }
  }
}
