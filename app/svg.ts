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
  twisting: number
}

export interface GearHoleProps {
  radius: number
  holes: number
  position: number
  angleOffset: number
}

export interface DoubleGearProps {
  diameter: number
  outer: GearProps
  inner: GearProps
  hole: GearHoleProps
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

  const betweenTeeth = segmentLen * (1 - props.toothWidth)
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

  if (props.twisting !== 0) {
    const twisting = props.twisting * segmentLen
    points[0] = points[0].rotateOnBy(center, twisting)
    points[1] = points[1].rotateOnBy(center, twisting)
  }

  if (props.roundGearShape && betweenTeeth > 0.05) {
    // distance between control points and start/end points on a unit circle:
    // 4/3 * tan(φ/4)
    const cpDist = Math.tan(betweenTeeth / 4) * 4 / 3 * gearRad

    const p1 = points[2]
    const p2 = points[3]

    // approximate a circle arc
    const cp1 = p1.sub(center).rotateRight().setAbs(cpDist).add(p1).setCp()
    const cp2 = p2.sub(center).rotateLeft().setAbs(cpDist).add(p2).setCp()

    points.splice(3, 0, cp1, cp2)
  }

  if (props.roundToothShape && toothEndWidth > 0.005) {
    const p1 = points[points.length - 1]            // sketch: F
      .rotateOnBy(center, segmentLen)
    const p2 = points[0]                            // sketch: A
    const p3 = points[1]                            // sketch: B
    const p4 = points[2]                            // sketch: G

    const m2 = p2.middleBetween(p3)                 // sketch: E
    const smallRad = p2.distance(p3) / 2            // A-E
    const m1 = p1.sub(p2).setAbs(smallRad).add(p2)  // sketch: F
    const m3 = p4.sub(p3).setAbs(smallRad).add(p3)  // sketch: G

    const phi = Math.PI - p2.angleBetween(m2, m1)

    const alpha = phi / 2
    const a = m2.distance(p2)
    const b = a / Math.tan(alpha)
    const c = Math.sqrt(a * a + b * b)

    // 4/3 * tan(φ/4)
    const cpDist = Math.tan(phi / 4) * 4 / 3 * c

    // approximate a circle arc
    const cp1 = p2.setDistance(cpDist, m1).setCp()
    const cp2 = p2.setDistance(cpDist, m2).setCp()
    const cp3 = p3.setDistance(cpDist, m2).setCp()
    const cp4 = p3.setDistance(cpDist, m3).setCp()

    points.splice(0, 2, m1, cp1, cp2, m2, cp3, cp4, m3)
  }

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

  let skip = 0

  return shape.map((p, i) => {
    if (skip) {
      skip -= 1
      return ''
    } else if (p.cp) {
      skip = 2
      const cp1 = p
      const cp2 = shape[i + 1]
      p = shape[i + 2]
      return `C ${cp1.toSvgStringNoCommas()}, ${cp2.toSvgStringNoCommas()}, ${p.toSvgStringNoCommas()} L`
    } else {
      return p.toSvgString()
    }
  }).join(' ')
    .replace(/L\s*C/g, 'C')
    .replace(/^\s+|\s*L\s*$/g, '')
    .replace(/\s\s+/g, ' ')
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

export let svgNumberPrecision = 2
