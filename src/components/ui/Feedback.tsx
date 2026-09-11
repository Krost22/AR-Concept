import { Icon } from './Icons'
import type { IconName } from '@/domain/experience/types'
import type { ReactNode } from 'react'

export function Spinner({ size = 28 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} aria-hidden="true" />
}

export interface StateMessageProps {
  icon?: IconName
  title: string
  message: string
  actions?: ReactNode
  tone?: 'neutral' | 'warning'
}

export function StateMessage({ icon = 'sparkle', title, message, actions, tone = 'neutral' }: StateMessageProps) {
  return (
    <div className={['state-message', `state-message--${tone}`].join(' ')} role="status">
      <span className="state-message__icon">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="state-message__title">{title}</h3>
      <p className="state-message__text">{message}</p>
      {actions ? <div className="state-message__actions">{actions}</div> : null}
    </div>
  )
}
