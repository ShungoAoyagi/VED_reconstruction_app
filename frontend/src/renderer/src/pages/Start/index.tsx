import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StartTemplate } from './template'
import type { Level } from '../../types'

function getLastPlayedLevel(): Level {
  const stored = localStorage.getItem('lastPlayedLevel')
  if (stored === 'easy' || stored === 'normal' || stored === 'hard') return stored
  return 'easy'
}

export const Start = () => {
  const navigate = useNavigate()
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const lastLevel = getLastPlayedLevel()

  return (
    <StartTemplate
      lastLevel={lastLevel}
      isTutorialOpen={isTutorialOpen}
      onOpenTutorial={() => setIsTutorialOpen(true)}
      onCloseTutorial={() => setIsTutorialOpen(false)}
      onStart={() => navigate('/level-select')}
    />
  )
}
