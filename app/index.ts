import { byId } from './domHelper'
import { NumberInput, mapAtLeast, degreeMapper, percentMapper } from './numberInput'
import { DoubleGearProps, makeSvg } from './svg'

const svgWrapper = byId('svg', HTMLElement)

function createInputs(callback: () => void): () => DoubleGearProps {
  const diameter           = new NumberInput(100,  0, mapAtLeast(1))

  const outerRadius        = new NumberInput(0.90, 1, percentMapper)
  const outerTeeth         = new NumberInput(32,   0, mapAtLeast(3))
  const outerToothLen      = new NumberInput(1,    1, percentMapper)
  const outerToothWidth    = new NumberInput(0.85, 1, percentMapper)
  const outerToothEndWidth = new NumberInput(0.15, 1, percentMapper)
  const outerAngleOffset   = new NumberInput(0,    1, degreeMapper)

  const innerRadius        = new NumberInput(0.71, 1, percentMapper)
  const innerTeeth         = new NumberInput(5,    0, mapAtLeast(0))
  const innerToothLen      = new NumberInput(0.24, 1, percentMapper)
  const innerToothWidth    = new NumberInput(0.35, 1, percentMapper)
  const innerToothEndWidth = new NumberInput(0.05, 1, percentMapper)
  const innerAngleOffset   = new NumberInput(0,    1, degreeMapper)

  byId('commonConfig', HTMLElement).append(
    diameter.getLabel('Diameter'),
  )

  byId('outerConfig', HTMLElement).append(
    outerRadius.getLabel('Radius'),
    outerTeeth.getLabel('Teeth'),
    outerToothLen.getLabel('Tooth length'),
    outerToothWidth.getLabel('Tooth width'),
    outerToothEndWidth.getLabel('Tooth end width'),
    outerAngleOffset.getLabel('Angle offset'),
  )

  byId('innerConfig', HTMLElement).append(
    innerRadius.getLabel('Radius'),
    innerTeeth.getLabel('Teeth'),
    innerToothLen.getLabel('Tooth length'),
    innerToothWidth.getLabel('Tooth width'),
    innerToothEndWidth.getLabel('Tooth end width'),
    innerAngleOffset.getLabel('Angle offset'),
  );

  [
    diameter,
    outerRadius,
    innerRadius,
    outerTeeth,
    innerTeeth,
    outerToothLen,
    innerToothLen,
    outerToothWidth,
    innerToothWidth,
    outerToothEndWidth,
    innerToothEndWidth,
    outerAngleOffset,
    innerAngleOffset,
  ].forEach(input => input.change.on(callback))

  return () => ({
    diameter: diameter.value,
    outer: {
      radius: outerRadius.value,
      teeth: outerTeeth.value,
      toothLen: outerToothLen.value,
      toothWidth: outerToothWidth.value,
      toothEndWidth: outerToothEndWidth.value,
      angleOffset: outerAngleOffset.value,
    },
    inner: {
      radius: innerRadius.value,
      teeth: innerTeeth.value,
      toothLen: innerToothLen.value,
      toothWidth: innerToothWidth.value,
      toothEndWidth: innerToothEndWidth.value,
      angleOffset: innerAngleOffset.value,
    },
  })
}

const getInputs = createInputs(refresh)

function refresh() {
  svgWrapper.innerHTML = makeSvg(getInputs())
}

refresh()
