import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../../components/PrimaryButton'
import { TutorialModal } from '../../components/TutorialModal'
import { InlineRanking } from '../../components/InlineRanking'
import { LevelSelector } from '../../components/LevelSelector'
import { fontWeight } from '../../design_token'
import type { Level } from '../../types'

const C = {
  bg: '#0D1117',
  textSub: '#8B949E'
} as const

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: ${C.bg};
  padding: 60px 40px 40px;
  gap: 24px;
`

const TopRightButtons = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
`

const HelpButton = styled.button`
  padding: 6px 16px;
  background: transparent;
  color: ${C.textSub};
  font-size: 0.9rem;
  font-weight: ${fontWeight.semibold};
  border: 1px solid rgba(99, 102, 241, 0.28);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: 0.03em;

  &:hover {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.6);
    color: #818cf8;
  }
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: ${fontWeight.bold};
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #818cf8 0%, #3b82f6 50%, #818cf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #3b82f6);
  border-radius: 1px;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`

const LearnButton = styled.button`
  padding: 11px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: 0.03em;
  background: transparent;
  border: 1.5px solid rgba(99, 102, 241, 0.45);
  color: #818cf8;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.7);
    color: #a5b4fc;
  }

  &:active {
    transform: translateY(1px);
  }
`

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #f85149;
`

export type StartTemplateProps = {
  selectedLevel: Level
  onSelectLevel: (level: Level) => void
  isLoading: boolean
  error: string
  isTutorialOpen: boolean
  onOpenTutorial: () => void
  onCloseTutorial: () => void
  onStart: () => void
}

export const StartTemplate = ({
  selectedLevel,
  onSelectLevel,
  isLoading,
  error,
  isTutorialOpen,
  onOpenTutorial,
  onCloseTutorial,
  onStart
}: StartTemplateProps) => {
  const navigate = useNavigate()

  return (
    <Container>
      <TopRightButtons>
        <HelpButton onClick={onOpenTutorial}>遊び方</HelpButton>
      </TopRightButtons>

      <Title>電子を観察してみよう</Title>
      <Divider />

      <ButtonRow>
        <PrimaryButton onClick={onStart} disabled={isLoading}>
          {isLoading ? '読み込み中...' : 'ゲームスタート'}
        </PrimaryButton>
        <LearnButton onClick={() => navigate('/physics')}>原理を知る</LearnButton>
      </ButtonRow>
      {error && <ErrorText>{error}</ErrorText>}

      <LevelSelector selectedLevel={selectedLevel} onSelectLevel={onSelectLevel} />

      <InlineRanking initialLevel={selectedLevel} showLevelTabs={false} />

      <TutorialModal isOpen={isTutorialOpen} onClose={onCloseTutorial} />
    </Container>
  )
}
