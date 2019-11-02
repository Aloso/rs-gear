export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public toSvgString() {
    return this.x.toFixed(svgNumberPrecision) + ',' + this.y.toFixed(svgNumberPrecision)
  }

  // noinspection JSUnusedGlobalSymbols
  public toCompressedSvgString() {
    return this.x.toFixed(svgNumberPrecision).replace(/0+$/, '')
      + ',' + this.y.toFixed(svgNumberPrecision).replace(/0+$/, '')
  }

  public rotateOnBy(center: Point, angle: number) {
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const nx = (cos * (this.x - center.x)) + (sin * (this.y - center.y)) + center.x
    const ny = (cos * (this.y - center.y)) - (sin * (this.x - center.x)) + center.y
    return new Point(nx, ny)
  }

  public middleBetween(other: Point) {
    return new Point((this.x + other.x) / 2, (this.y + other.y) / 2)
  }

  public add(x: number, y: number) {
    return new Point(this.x + y, this.y + y)
  }
}

export let svgNumberPrecision = 2
