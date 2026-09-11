import { lazy, Suspense, useEffect } from 'react'

import { useNavigation } from '@/app/navigation/NavigationContext'
import { Spinner } from '@/components/ui/Feedback'
import { HomeScreen } from '@/features/home/HomeScreen'
import { InfoScreen } from '@/features/info/InfoScreen'
import { PrepareScreen } from '@/features/prepare/PrepareScreen'

const ARScreen = lazy(() =>
  import('@/features/ar/ARScreen').then((module) => ({ default: module.ARScreen })),
)

function ScreenLoading() {
  return (
    <main className="screen screen--loading">
      <Spinner size={30} />
      <p>Cargando experiencia…</p>
    </main>
  )
}

export function App() {
  const { screen, transitionKey } = useNavigation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [transitionKey])

  return (
    <div className="app">
      <div className="app__viewport" key={transitionKey}>
        {screen.name === 'home' ? <HomeScreen /> : null}
        {screen.name === 'prepare' ? <PrepareScreen experienceId={screen.experienceId} /> : null}
        {screen.name === 'ar' ? (
          <Suspense fallback={<ScreenLoading />}>
            <ARScreen experienceId={screen.experienceId} initialMode={screen.mode} />
          </Suspense>
        ) : null}
        {screen.name === 'info' ? (
          <InfoScreen experienceId={screen.experienceId} sectionId={screen.sectionId} />
        ) : null}
      </div>
    </div>
  )
}
