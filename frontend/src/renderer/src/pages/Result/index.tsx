import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ResultTemplate } from './template'
import { api } from '../../api/client'
import type { Level } from '../../types'

type ResultState = {
  level?: Level
  score?: number
  inRanking?: boolean
  isCorrect?: boolean
  elapsedSeconds?: number
}

export const Result = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resultState = (location.state as ResultState) ?? {}
  const {
    level = 'easy',
    score = 0,
    inRanking = false,
    isCorrect = false,
    elapsedSeconds
  } = resultState

  const [username, setUsername] = useState('')
  const [nameError, setNameError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rankingKey, setRankingKey] = useState(0)
  const [submittedUsername, setSubmittedUsername] = useState('')

  const handleSubmitRanking = async () => {
    if (username.length === 0) {
      setNameError('名前を入力してください')
      return
    }
    if (username.length > 10) {
      setNameError('10文字以内で入力してね')
      return
    }
    setNameError('')
    setIsSubmitting(true)
    try {
      await api.addUserToRanking(level, username)
      setSubmittedUsername(username)
      setIsSubmitted(true)
      setRankingKey((k) => k + 1)
    } catch {
      setNameError('登録に失敗しました。再度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResultTemplate
      level={level}
      score={score}
      isCorrect={isCorrect}
      elapsedSeconds={elapsedSeconds}
      inRanking={inRanking}
      isSubmitted={isSubmitted}
      isSubmitting={isSubmitting}
      username={username}
      submittedUsername={submittedUsername}
      nameError={nameError}
      rankingKey={rankingKey}
      onUsernameChange={setUsername}
      onSubmitRanking={handleSubmitRanking}
      onGoHome={() => navigate('/')}
    />
  )
}
