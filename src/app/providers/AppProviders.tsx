import type { ReactNode } from 'react'

import { NavigationProvider } from '@/app/navigation/NavigationContext'
import { AppErrorBoundary } from './AppErrorBoundary'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <NavigationProvider>{children}</NavigationProvider>
    </AppErrorBoundary>
  )
}
