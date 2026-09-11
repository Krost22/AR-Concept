import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Icon } from './Icons'
import type { IconName } from '@/domain/experience/types'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  iconLeft?: IconName
  iconRight?: IconName
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full' : '',
    loading ? 'button--loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      {!loading && iconLeft ? <Icon name={iconLeft} size={size === 'sm' ? 16 : 18} /> : null}
      <span className="button__label">{children}</span>
      {!loading && iconRight ? <Icon name={iconRight} size={size === 'sm' ? 16 : 18} /> : null}
    </button>
  )
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: string
  variant?: 'solid' | 'glass' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  badge?: ReactNode
}

export function IconButton({
  icon,
  label,
  variant = 'solid',
  size = 'md',
  badge,
  className,
  ...rest
}: IconButtonProps) {
  const classes = ['icon-button', `icon-button--${variant}`, `icon-button--${size}`, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20} />
      {badge ? <span className="icon-button__badge">{badge}</span> : null}
    </button>
  )
}
