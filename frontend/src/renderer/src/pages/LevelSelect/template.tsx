import styled from 'styled-components'
import { fontWeight } from '../../design_token'
import type { Level } from '../../types'
import { PrimaryButton } from '../../components/PrimaryButton'
import { TutorialModal } from '../../components/TutorialModal'
import {
  levelDescriptions,
  levelLabels,
  levelColors,
  levelRoughDescriptions
} from '../../const/level'

const C = {
  bg: '#0D1117',
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  borderHover: 'rgba(99, 102, 241, 0.5)',
  text: '#E6EDF3',
  textSub: '#8B949E'
} as const

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${C.bg};
  padding: 40px;
  gap: 32px;
`

const Header = styled.div`
  position: fixed;
  top: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
`

const NavButton = styled.button`
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

const Title = styled.h2`
  font-size: 2rem;
  font-weight: ${fontWeight.bold};
  color: ${C.text};
  letter-spacing: 0.02em;
`

const LevelGrid = styled.div`
  display: flex;
  gap: 20px;
`

const LevelCard = styled.button<{ $selected: boolean; $color: string }>`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 32px;
  background: ${({ $selected, $color }) => ($selected ? `${$color}22` : C.card)};
  border: 2px solid ${({ $selected, $color }) => ($selected ? $color : C.border)};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  box-shadow: ${({ $selected, $color }) =>
    $selected ? `0 4px 24px ${$color}40` : '0 4px 16px rgba(0,0,0,0.3)'};

  &:hover {
    border-color: ${({ $color }) => $color};
    box-shadow: 0 4px 24px ${({ $color }) => `${$color}40`};
    background: ${({ $color }) => `${$color}15`};
  }
`

const LevelLabel = styled.span<{ $color: string }>`
  font-size: 1.2rem;
  font-weight: ${fontWeight.bold};
  color: ${({ $color }) => $color};
  letter-spacing: 0.04em;
`

const LevelRoughDescription = styled.p`
  font-size: 1.1rem;
  color: ${C.text};
  text-align: center;
  max-width: 250px;
  white-space: pre-line;
  line-height: 1.5;
`

const LevelDescription = styled.p`
  font-size: 1rem;
  color: ${C.textSub};
  text-align: center;
  max-width: 250px;
  white-space: pre-line;
  line-height: 1.5;
`

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #f85149;
`

type LevelSelectTemplateProps = {
  navigate: (path: string) => void
  isTutorialOpen: boolean
  setIsTutorialOpen: (isOpen: boolean) => void
  error: string
  handleStart: () => void
  isLoading: boolean
  selectedLevel: Level | null
  setSelectedLevel: (level: Level | null) => void
}

export const LevelSelectTemplate = ({
  navigate,
  isTutorialOpen,
  setIsTutorialOpen,
  error,
  handleStart,
  isLoading,
  selectedLevel,
  setSelectedLevel
}: LevelSelectTemplateProps) => {
  return (
    <Container>
      <Header>
        <NavButton onClick={() => navigate('/')}>←</NavButton>
        <NavButton onClick={() => setIsTutorialOpen(true)}>?</NavButton>
      </Header>
      <Title>レベルを選んでね</Title>
      <LevelGrid>
        {(['easy', 'normal', 'hard'] as const).map((level) => (
          <LevelCard
            key={level}
            $selected={selectedLevel === level}
            $color={levelColors[level]}
            onClick={() => setSelectedLevel(level)}
          >
            <LevelLabel $color={levelColors[level]}>{levelLabels[level]}</LevelLabel>
            <LevelRoughDescription>{levelRoughDescriptions[level]}</LevelRoughDescription>
            <LevelDescription>{levelDescriptions[level]}</LevelDescription>
          </LevelCard>
        ))}
      </LevelGrid>
      {error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton onClick={handleStart} disabled={!selectedLevel || isLoading}>
        {isLoading ? '読み込み中...' : 'スタート'}
      </PrimaryButton>
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </Container>
  )
}
