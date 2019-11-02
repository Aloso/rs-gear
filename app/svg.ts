import { Point } from './point'

export interface GearProps {
  radius: number
  toothLen: number
  toothWidth: number
  toothEndWidth: number
  teeth: number
  angleOffset: number
}

export interface DoubleGearProps {
  diameter: number
  outer: GearProps
  inner: GearProps
}

function getGearPath(diameter: number, props: GearProps, outside: boolean) {
  const rad = diameter / 2
  const gearRad = rad * props.radius

  const toothLength = outside
    ? (rad - gearRad) * props.toothLen
    : (    - gearRad) * props.toothLen

  const segmentLen = 2 * Math.PI / props.teeth

  const toothEndWidth = segmentLen * props.toothEndWidth
  const slantWidth = (segmentLen * props.toothWidth - toothEndWidth) / 2

  const center = new Point(rad, rad)

  const circle = new Point(rad, rad - gearRad)
  const tooth = new Point(rad, rad - gearRad - toothLength)

  const points: Point[] = [
    tooth.rotateOnBy(center, toothEndWidth / 2),
    tooth.rotateOnBy(center, -toothEndWidth / 2),
    circle.rotateOnBy(center, -toothEndWidth / 2 - slantWidth),
    circle.rotateOnBy(center, -segmentLen + toothEndWidth / 2 + slantWidth),
  ]

  const offset = props.angleOffset * Math.PI * 2

  const outer: Point[] = []
  for (let i = props.teeth - 1; i >= 0; i--) {
    for (const p of points) {
      outer.push(p.rotateOnBy(center, offset + i * segmentLen))
    }
  }

  return outer
}

export function getFullPath(props: DoubleGearProps) {
  const outer = getGearPath(props.diameter, props.outer, true)
  const inner = getGearPath(props.diameter, props.inner, false)

  return `M ${outer.map(c => c.toString()).join(' ')} z M ${inner.reverse().map(c => c.toString()).join(' ')} Z`
}

export function makeSvg(props: DoubleGearProps) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${props.diameter} ${props.diameter}"
        height="${props.diameter}px" width="${props.diameter}px"
        x="0px" y="0px">
        <path d="${getFullPath(props)}" />
    </svg>`
}
