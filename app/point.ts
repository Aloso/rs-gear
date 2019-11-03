import { svgNumberPrecision } from './svg'

export interface IPoint {
  x: number
  y: number
}

export class Point implements IPoint {
  public cp = false

  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public toString(): string {
    return `${this.cp ? 'CP' : 'P'}{${this.x.toFixed(1)} ${this.y.toFixed(1)}}`
  }

  public toSvgString(): string {
    return this.x.toFixed(svgNumberPrecision) + ',' + this.y.toFixed(svgNumberPrecision)
  }

  public toSvgStringNoCommas(): string {
    return this.x.toFixed(svgNumberPrecision) + ' ' + this.y.toFixed(svgNumberPrecision)
  }

  public rotateOnBy(center: IPoint, angle: number): Point {
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const nx = (cos * (this.x - center.x)) + (sin * (this.y - center.y)) + center.x
    const ny = (cos * (this.y - center.y)) - (sin * (this.x - center.x)) + center.y

    if (this.cp) return new Point(nx, ny).setCp()
    else return new Point(nx, ny)
  }

  public rotateRight(): Point {
    return new Point(-this.y, this.x)
  }

  public rotateLeft(): Point {
    return new Point(this.y, -this.x)
  }

  public middleBetween(other: IPoint): Point {
    return new Point((this.x + other.x) / 2, (this.y + other.y) / 2)
  }

  public add(other: IPoint): Point {
    return new Point(this.x + other.x, this.y + other.y)
  }

  public sub(other: IPoint): Point {
    return new Point(this.x - other.x, this.y - other.y)
  }

  public setAbs(abs: number): Point {
    const currentAbs = Math.sqrt(this.x * this.x + this.y * this.y)
    const factor = abs / currentAbs
    return new Point(this.x * factor, this.y * factor)
  }

  public setCp(): Point {
    this.cp = true
    return this
  }

  public absTo(other: IPoint): number {
    const x = this.x - other.x
    const y = this.y - other.y
    return Math.sqrt(x * x + y * y)
  }
}
