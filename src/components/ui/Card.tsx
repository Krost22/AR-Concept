import type { HTMLAttributes, ReactNode } from 'react'

import { Icon } from './Icons'
import type { IconName } from '@/domain/experience/types'

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: IconName
  tone?: 'neutral' | 'accent' | 'success' | 'warning'
  children: ReactNode
}

export function Chip({ icon, tone = 'neutral', className, children, ...rest }: ChipProps) {
  const classes = ['chip', `chip--${tone}`, className ?? ''].filter(Boolean).join(' ')
  return (
    <span className={classes} {...rest}>
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </span>
  )
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={['card', className ?? ''].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
