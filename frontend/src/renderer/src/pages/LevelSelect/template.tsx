import styled from 'styled-components'
import { colors, fontSize, spacing, fontWeight } from '../../design_token'
import { useState } from 'react'
import type { Level } from '../../types'
import { PrimaryButton } from '../../components/PrimaryButton'
import { IconButton } from '../../components/IconButton'
import { SelectButton } from '../../components/SelectButton'
import { TutorialModal } from '../../components/TutorialModal'
import { levelDescriptions, levelLabels, levelColors } from '../../const/level'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing['2xl']};
`

const Header = styled.div`
  position: fixed;
  top: ${spacing.lg};
  left: ${spacing.lg};
  right: ${spacing.lg};
  display: flex;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: ${fontSize['3xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.text};
  padding-bottom: ${spacing['2xl']};
`

const LevelGrid = styled.div`
  display: flex;
  gap: ${spacing.lg};
  padding-bottom: ${spacing['2xl']};
`

const LevelCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
`

const LevelDescription = styled.p`
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  text-align: center;
  max-width: 160px;
  white-space: pre-line;
`

const ErrorText = styled.p`
  font-size: ${fontSize.sm};
  color: ${colors.error};
  padding-bottom: ${spacing.sm};
`

type LevelSelectTemplateProps = {
  navigate: (path: string) => void
  isTutorialOpen: boolean
  setIsTutorialOpen: (isOpen: boolean) => void
  error: string
  handleStart: () => void
  isLoading: boolean
}

export const LevelSelectTemplate = ({
  navigate,
  isTutorialOpen,
  setIsTutorialOpen,
  error,
  handleStart,
  isLoading
}: LevelSelectTemplateProps) => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  return (
    <Container>
      <Header>
        <IconButton icon="back" onClick={() => navigate('/')} />
        <IconButton icon="help" onClick={() => setIsTutorialOpen(true)} />
      </Header>
      <Title>レベルを選んでね</Title>
      <LevelGrid>
        {(['easy', 'normal', 'hard'] as const).map((level) => (
          <LevelCard key={level}>
            <SelectButton
              selected={selectedLevel === level}
              onSelect={() => setSelectedLevel(level)}
              color={levelColors[level]}
            >
              {levelLabels[level]}
            </SelectButton>
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
