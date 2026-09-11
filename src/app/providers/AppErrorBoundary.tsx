import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { Button } from '@/components/ui/Button'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
  message?: string
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : undefined,
    }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Error en la aplicación', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="crash">
        <div className="crash__card">
          <h1 className="crash__title">Algo no salió como esperábamos</h1>
          <p className="crash__text">
            La experiencia se detuvo inesperadamente. Recarga la página para volver a intentarlo.
          </p>
          {this.state.message ? <code className="crash__code">{this.state.message}</code> : null}
          <Button onClick={this.handleReload}>Recargar aplicación</Button>
        </div>
      </main>
    )
  }
}
