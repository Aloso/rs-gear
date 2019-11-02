import { Point } from './point'

export interface GearProps {
  radius: number
  toothLen: number
  toothWidth: number
  toothEndWidth: number
  teeth: number
  angleOffset: number
  roundGearShape: boolean
  roundToothShape: boolean
}

export interface DoubleGearProps {
  diameter: number
  outer: GearProps
  inner: GearProps
}

function getSvgShape(diameter: number, props: GearProps, outside: boolean): string {
  const rad = diameter / 2
  const gearRad = rad * props.radius

  if (props.teeth === 0) {
    const drad = gearRad * 2
    return `${rad - gearRad},${rad} a ${gearRad},${gearRad} 0 1,0 ${drad},0 a ${gearRad},${gearRad} 0 1,0 -${drad},0`
  }

  const toothLength = outside
    ? (rad - gearRad) * props.toothLen
    : (-gearRad) * props.toothLen

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

  let shape: Point[] = []
  for (let i = props.teeth - 1; i >= 0; i--) {
    for (const p of points) {
      shape.push(p.rotateOnBy(center, offset + i * segmentLen))
    }
  }

  if (!outside) {
    shape = shape.reverse()
  }

  return shape.map(p => p.toSvgString()).join(' ')
}

export function getSvgPath(props: DoubleGearProps): string {
  const outer = getSvgShape(props.diameter, props.outer, true)
  const inner = getSvgShape(props.diameter, props.inner, false)

  return `M ${outer} z M ${inner} Z`
}

export function makeSvg(props: DoubleGearProps): string {
  // language=SVG
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${props.diameter} ${props.diameter}"
        height="${props.diameter}px" width="${props.diameter}px"
        x="0px" y="0px">
        <path d="${getSvgPath(props)}" />
    </svg>`
}
