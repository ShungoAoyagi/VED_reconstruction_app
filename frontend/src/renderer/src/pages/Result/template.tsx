import styled from 'styled-components'
import { PrimaryButton } from '../../components/PrimaryButton'
import { Input } from '../../components/Input'
import { InlineRanking } from '../../components/InlineRanking'
import { colors, fontSize, spacing, fontWeight, borderRadius } from '../../design_token'
import type { Level } from '../../types'
import { levelColors, levelLabels } from '../../const/level'

const Container = styled.div`
  display: flex;
  align-items: flex-start;
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

const CorrectBanner = styled.div`
  font-size: ${fontSize['2xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.success};
  background: #ecfdf5;
  padding: ${spacing.sm} ${spacing.xl};
  border-radius: ${borderRadius.lg};
`

const ElapsedTime = styled.p`
  font-size: ${fontSize.base};
  color: ${colors.textSecondary};
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

const LevelBadge = styled.span<{ $level: Level }>`
  font-size: ${fontSize.sm};
  color: ${colors.white};
  background: ${({ $level }) => levelColors[$level]};
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

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.round((seconds % 1) * 10)
  if (m > 0) return `${m}分${s}.${ms}秒`
  return `${s}.${ms}秒`
}

export type ResultTemplateProps = {
  level: Level
  score: number
  isCorrect: boolean
  elapsedSeconds?: number
  inRanking: boolean
  isSubmitted: boolean
  isSubmitting: boolean
  username: string
  nameError: string
  rankingKey: number
  onUsernameChange: (value: string) => void
  onSubmitRanking: () => void
  onGoHome: () => void
}

export const ResultTemplate = ({
  level,
  score,
  isCorrect,
  elapsedSeconds,
  inRanking,
  isSubmitted,
  isSubmitting,
  username,
  nameError,
  rankingKey,
  onUsernameChange,
  onSubmitRanking,
  onGoHome
}: ResultTemplateProps) => {
  return (
    <Container>
      <ResultCard>
        <Title>結果</Title>
        <LevelBadge $level={level}>{levelLabels[level]}</LevelBadge>

        {isCorrect && <CorrectBanner>正解！</CorrectBanner>}

        {elapsedSeconds != null && (
          <ElapsedTime>回答時間: {formatElapsed(elapsedSeconds)}</ElapsedTime>
        )}

        <ScoreLabel>あなたのスコア</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>

        {inRanking && !isSubmitted && (
          <>
            <RankingNotice>ランキング入りしました！</RankingNotice>
            <NameInputSection>
              <Input
                placeholder="名前 (10文字以内)"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                error={nameError}
                maxLength={10}
              />
              <PrimaryButton onClick={onSubmitRanking} disabled={isSubmitting}>
                {isSubmitting ? '登録中...' : 'ランキングに登録'}
              </PrimaryButton>
            </NameInputSection>
          </>
        )}

        {isSubmitted && <RankingNotice>ランキングに登録しました！</RankingNotice>}

        <PrimaryButton onClick={onGoHome}>トップに戻る</PrimaryButton>
      </ResultCard>

      <InlineRanking key={rankingKey} initialLevel={level} showLevelTabs={false} />
    </Container>
  )
}
