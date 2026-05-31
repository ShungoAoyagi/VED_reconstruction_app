import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { Level } from '../../types'
import { LevelSelectTemplate } from './template'

export const LevelSelect = () => {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  const handleStart = async () => {
    if (!selectedLevel) return
    setIsLoading(true)
    setError('')
    try {
      console.log('selectedLevel', selectedLevel)
      const response = await api.startGame(selectedLevel)
      navigate('/playing', {
        state: {
          level: selectedLevel,
          gameData: response
        }
      })
    } catch (e) {
      setError('サーバーとの通信に失敗しました。再度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LevelSelectTemplate
      navigate={navigate}
      isTutorialOpen={isTutorialOpen}
      setIsTutorialOpen={setIsTutorialOpen}
      error={error}
      handleStart={handleStart}
      isLoading={isLoading}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
    />
  )
}
