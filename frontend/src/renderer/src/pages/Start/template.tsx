import styled from 'styled-components'
import { PrimaryButton } from '../../components/PrimaryButton'
import { IconButton } from '../../components/IconButton'
import { TutorialModal } from '../../components/TutorialModal'
import { InlineRanking } from '../../components/InlineRanking'
import { colors, fontSize, spacing, fontWeight } from '../../design_token'
import type { Level } from '../../types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing['2xl']};
  padding-top: 120px;
  gap: ${spacing.lg};
`

const Title = styled.h1`
  font-size: ${fontSize['4xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.text};
`

const Subtitle = styled.p`
  font-size: ${fontSize.lg};
  color: ${colors.textSecondary};
  text-align: center;
`

const HelpButtonWrapper = styled.div`
  position: fixed;
  top: ${spacing.lg};
  right: ${spacing.lg};
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
  return (
    <Container>
      <HelpButtonWrapper>
        <IconButton icon="help" onClick={onOpenTutorial} />
      </HelpButtonWrapper>
      <Title>VED Reconstruction</Title>
      <Subtitle>電子を観察してみよう</Subtitle>
      <PrimaryButton onClick={onStart}>スタート</PrimaryButton>
      <InlineRanking initialLevel={lastLevel} showLevelTabs />
      <TutorialModal isOpen={isTutorialOpen} onClose={onCloseTutorial} />
    </Container>
  )
}
