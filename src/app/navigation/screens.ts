import type { ExperienceId } from '@/domain/experience/types'

export type ARLaunchMode = 'auto' | 'studio' | 'camera'

export type Screen =
  | { name: 'home' }
  | { name: 'prepare'; experienceId: ExperienceId }
  | { name: 'ar'; experienceId: ExperienceId; mode?: ARLaunchMode }
  | { name: 'info'; experienceId: ExperienceId; sectionId?: string }

export type ScreenName = Screen['name']

export interface NavigationState {
  screen: Screen
  history: Screen[]
  transitionKey: number
}
