import { useId } from 'react'

export interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  valueLabel?: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, step = 0.05, valueLabel, onChange }: SliderProps) {
  const id = useId()
  const progress = ((value - min) / (max - min)) * 100

  return (
    <div className="slider">
      <div className="slider__header">
        <label className="slider__label" htmlFor={id}>
          {label}
        </label>
        {valueLabel ? <span className="slider__value">{valueLabel}</span> : null}
      </div>
      <input
        id={id}
        className="slider__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--slider-progress' as string]: `${progress}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
