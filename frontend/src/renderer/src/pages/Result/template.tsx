import { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import Confetti from 'react-confetti'
import { PrimaryButton } from '../../components/PrimaryButton'
import { Input } from '../../components/Input'
import { InlineRanking } from '../../components/InlineRanking'
import { fontWeight } from '../../design_token'
import type { Level } from '../../types'
import { levelColors, levelLabels } from '../../const/level'

const C = {
  bg: '#0D1117',
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  text: '#E6EDF3',
  textSub: '#8B949E',
  accent: '#6366F1',
  accentBlue: '#3B82F6',
  success: '#3FB950',
  error: '#F85149'
} as const

const popIn = keyframes`
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  background: ${C.bg};
  padding: 60px 40px;
  gap: 32px;
`

const ResultCard = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  padding: 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: ${popIn} 0.3s ease;
`

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: ${fontWeight.bold};
  color: ${C.text};
  letter-spacing: 0.04em;
`

const LevelBadge = styled.span<{ $level: Level }>`
  font-size: 0.82rem;
  font-weight: ${fontWeight.bold};
  color: #ffffff;
  background: ${({ $level }) => levelColors[$level]};
  padding: 3px 14px;
  border-radius: 999px;
  letter-spacing: 0.06em;
`

const CorrectBanner = styled.div`
  font-size: 1.3rem;
  font-weight: ${fontWeight.bold};
  color: ${C.success};
  background: rgba(63, 185, 80, 0.12);
  border: 1px solid rgba(63, 185, 80, 0.3);
  padding: 8px 28px;
  border-radius: 10px;
  letter-spacing: 0.06em;
`

const ElapsedTime = styled.p`
  font-size: 0.9rem;
  color: ${C.textSub};
`

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const ScoreLabel = styled.p`
  font-size: 0.82rem;
  color: ${C.textSub};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const ScoreValue = styled.p<{ $animating: boolean }>`
  font-size: 3.5rem;
  font-weight: ${fontWeight.bold};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  background: linear-gradient(135deg, #818cf8, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: ${({ $animating }) => ($animating ? 'none' : 'all 0.2s ease')};
  ${({ $animating }) =>
    $animating &&
    css`
      filter: blur(0.5px);
    `}
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${C.border};
`

const FadeUpSection = styled.div<{ $delay?: number }>`
  width: 100%;
  display: contents;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $delay }) => $delay ?? 0}ms;
`

const RankingNotice = styled.p`
  font-size: 0.95rem;
  color: ${C.success};
  font-weight: ${fontWeight.semibold};
  text-align: center;
`

const NameInputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`

const RankingSideWrapper = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s ease;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  width: 400px;
  display: flex;
  align-items: center;
`

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (m > 0) return `${m}分${s}秒`
  return `${s}秒`
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
  submittedUsername: string
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
  submittedUsername,
  nameError,
  rankingKey,
  onUsernameChange,
  onSubmitRanking,
  onGoHome
}: ResultTemplateProps) => {
  const [displayScore, setDisplayScore] = useState(0)
  const [isAnimationDone, setIsAnimationDone] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [recycleConfetti, setRecycleConfetti] = useState(true)
  const rafRef = useRef<number | null>(null)

  // スコアカウンターアニメーション（ease-out cubic、スロット風）
  useEffect(() => {
    if (score === 0) {
      setDisplayScore(0)
      setIsAnimationDone(true)
      return
    }

    const duration = 1100
    const start = performance.now()

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayScore(score)
        setIsAnimationDone(true)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [score])

  // アニメーション完了かつランキング入りでconfettiを表示
  useEffect(() => {
    if (!isAnimationDone || !inRanking) return
    setShowConfetti(true)
    const timer = setTimeout(() => setRecycleConfetti(false), 3500)
    return () => clearTimeout(timer)
  }, [isAnimationDone, inRanking])

  return (
    <Container>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={recycleConfetti}
          numberOfPieces={300}
          gravity={0.25}
          colors={['#818CF8', '#3B82F6', '#F97316', '#3FB950', '#F59E0B', '#FB7185']}
          style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
        />
      )}

      <ResultCard>
        <Title>結果</Title>
        <LevelBadge $level={level}>{levelLabels[level]}</LevelBadge>

        {isCorrect && <CorrectBanner>🎉 正解！</CorrectBanner>}

        {elapsedSeconds != null && (
          <ElapsedTime>回答時間: {formatElapsed(elapsedSeconds)}</ElapsedTime>
        )}

        <ScoreSection>
          <ScoreLabel>あなたのスコア</ScoreLabel>
          <ScoreValue $animating={!isAnimationDone}>{displayScore}</ScoreValue>
        </ScoreSection>

        {/* アニメーション完了後にランキング登録UIを表示 */}
        {isAnimationDone && (
          <>
            {(inRanking || isSubmitted) && <Divider />}

            {inRanking && !isSubmitted && (
              <FadeUpSection>
                <RankingNotice>ランキング入り！名前を登録しますか？</RankingNotice>
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
              </FadeUpSection>
            )}

            {isSubmitted && (
              <FadeUpSection>
                <RankingNotice>ランキングに登録しました！</RankingNotice>
              </FadeUpSection>
            )}
          </>
        )}

        <PrimaryButton onClick={onGoHome}>トップに戻る</PrimaryButton>
      </ResultCard>

      {/* ランキングはアニメーション完了後にフェードイン */}
      <RankingSideWrapper $visible={isAnimationDone}>
        <InlineRanking
          key={rankingKey}
          initialLevel={level}
          showLevelTabs={false}
          highlightUsername={submittedUsername || undefined}
        />
      </RankingSideWrapper>
    </Container>
  )
}
