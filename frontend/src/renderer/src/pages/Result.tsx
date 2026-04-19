import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PrimaryButton } from '../components/PrimaryButton'
import { Input } from '../components/Input'
import { InlineRanking } from '../components/InlineRanking'
import { api } from '../api/client'
import { colors, fontSize, spacing, fontWeight, borderRadius } from '../design_token'
import type { Level } from '../types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing['2xl']};
  gap: ${spacing.lg};
`

const ResultCard = styled.div`
  background: ${colors.white};
  padding: ${spacing['2xl']};
  border-radius: ${borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.lg};
  min-width: 400px;
`

const Title = styled.h2`
  font-size: ${fontSize['3xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.text};
`

const ScoreLabel = styled.p`
  font-size: ${fontSize.lg};
  color: ${colors.textSecondary};
`

const ScoreValue = styled.p`
  font-size: ${fontSize['4xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.primary};
`

const LevelBadge = styled.span`
  font-size: ${fontSize.sm};
  color: ${colors.white};
  background: ${colors.primary};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.full};
`

const RankingNotice = styled.p`
  font-size: ${fontSize.base};
  color: ${colors.success};
  font-weight: ${fontWeight.semibold};
`

const NameInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
`

const levelLabels: Record<Level, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'むずかしい'
}

type ResultState = {
  level?: Level
  score?: number
  inRanking?: boolean
}

export const Result = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resultState = (location.state as ResultState) ?? {}
  const { level = 'easy', score = 0, inRanking = false } = resultState

  const [username, setUsername] = useState('')
  const [nameError, setNameError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rankingKey, setRankingKey] = useState(0)

  const handleSubmitRanking = async () => {
    if (username.length === 0) {
      setNameError('名前を入力してください')
      return
    }
    if (username.length > 10) {
      setNameError('10文字以内で入力してください')
      return
    }
    setNameError('')
    setIsSubmitting(true)
    try {
      await api.addUserToRanking(level, username)
      setIsSubmitted(true)
      setRankingKey((k) => k + 1)
    } catch {
      setNameError('登録に失敗しました。再度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <ResultCard>
        <Title>結果</Title>
        <LevelBadge>{levelLabels[level]}</LevelBadge>
        <ScoreLabel>あなたのスコア</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>

        {inRanking && !isSubmitted && (
          <>
            <RankingNotice>ランキング入りしました！</RankingNotice>
            <NameInputSection>
              <Input
                placeholder="名前 (10文字以内)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={nameError}
                maxLength={10}
              />
              <PrimaryButton
                onClick={handleSubmitRanking}
                disabled={isSubmitting}
              >
                {isSubmitting ? '登録中...' : 'ランキングに登録'}
              </PrimaryButton>
            </NameInputSection>
          </>
        )}

        {isSubmitted && (
          <RankingNotice>ランキングに登録しました！</RankingNotice>
        )}

        <PrimaryButton onClick={() => navigate('/')}>
          トップに戻る
        </PrimaryButton>
      </ResultCard>

      <InlineRanking key={rankingKey} initialLevel={level} showLevelTabs={false} />
    </Container>
  )
}
