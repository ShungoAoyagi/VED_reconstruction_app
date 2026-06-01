import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../../components/PrimaryButton'
import { TutorialModal } from '../../components/TutorialModal'
import { InlineRanking } from '../../components/InlineRanking'
import { fontWeight } from '../../design_token'
import type { Level } from '../../types'

const C = {
  bg: '#0D1117',
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  text: '#E6EDF3',
  textSub: '#8B949E',
  accent: '#6366F1',
  accentBlue: '#3B82F6'
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
  padding: 80px 40px 40px;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  color: ${C.textSub};
  font-size: 1.25rem;
  border: 1px solid rgba(99, 102, 241, 0.28);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;

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

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${C.textSub};
  letter-spacing: 0.04em;
`

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #3b82f6);
  border-radius: 1px;
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

const CenterButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`

export type StartTemplateProps = {
  lastLevel: Level
  isTutorialOpen: boolean
  onOpenTutorial: () => void
  onCloseTutorial: () => void
  onStart: () => void
}

export const StartTemplate = ({
  lastLevel,
  isTutorialOpen,
  onOpenTutorial,
  onCloseTutorial,
  onStart
}: StartTemplateProps) => {
  const navigate = useNavigate()

  return (
    <Container>
      <TopRightButtons>
        <HelpButton onClick={onOpenTutorial}>?</HelpButton>
      </TopRightButtons>
      <Title>電子を観察してみよう</Title>
      <Subtitle>電子のミクロな構造を当てよう</Subtitle>
      <Divider />
      <CenterButtonWrapper>
        <PrimaryButton onClick={onStart}>ゲームスタート</PrimaryButton>
        <LearnButton onClick={() => navigate('/physics')}>原理を知る</LearnButton>
      </CenterButtonWrapper>
      <InlineRanking initialLevel={lastLevel} showLevelTabs />
      <TutorialModal isOpen={isTutorialOpen} onClose={onCloseTutorial} />
    </Container>
  )
}
