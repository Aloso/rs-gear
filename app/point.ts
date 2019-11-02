export class Point {
  constructor(readonly x: number, readonly y: number) {
  }

  public toString() {
    return this.x.toFixed(2) + ',' + this.y.toFixed(2)
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

  public setX(x: number): Point {
    return new Point(x, this.y)
  }

  public setY(y: number): Point {
    return new Point(this.x, y)
  }
}
