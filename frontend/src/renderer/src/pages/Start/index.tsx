import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
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
  const [selectedLevel, setSelectedLevel] = useState<Level>(getLastPlayedLevel())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await api.startGame(selectedLevel)
      navigate('/playing', {
        state: {
          level: selectedLevel,
          gameData: response
        }
      })
    } catch {
      setError('サーバーとの通信に失敗しました。再度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <StartTemplate
      selectedLevel={selectedLevel}
      onSelectLevel={setSelectedLevel}
      isLoading={isLoading}
      error={error}
      isTutorialOpen={isTutorialOpen}
      onOpenTutorial={() => setIsTutorialOpen(true)}
      onCloseTutorial={() => setIsTutorialOpen(false)}
      onStart={handleStart}
    />
  )
}
