import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { Screen, NavigationState } from './screens'

interface NavigationContextValue extends NavigationState {
  navigate: (screen: Screen) => void
  goBack: () => void
  goHome: () => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

const INITIAL_STATE: NavigationState = {
  screen: { name: 'home' },
  history: [],
  transitionKey: 0,
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [state, setState] = useState<NavigationState>(INITIAL_STATE)

  const navigate = useCallback((screen: Screen) => {
    setState((current) => ({
      screen,
      history: [...current.history, current.screen],
      transitionKey: current.transitionKey + 1,
    }))
  }, [])

  const goBack = useCallback(() => {
    setState((current) => {
      const previous = current.history[current.history.length - 1]
      if (!previous) return current
      return {
        screen: previous,
        history: current.history.slice(0, -1),
        transitionKey: current.transitionKey + 1,
      }
    })
  }, [])

  const goHome = useCallback(() => {
    setState((current) => ({
      screen: { name: 'home' },
      history: [],
      transitionKey: current.transitionKey + 1,
    }))
  }, [])

  const value = useMemo<NavigationContextValue>(
    () => ({ ...state, navigate, goBack, goHome }),
    [state, navigate, goBack, goHome],
  )

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation debe usarse dentro de NavigationProvider')
  }
  return context
}
