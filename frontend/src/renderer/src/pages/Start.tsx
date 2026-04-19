import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { PrimaryButton } from '../components/PrimaryButton'
import { IconButton } from '../components/IconButton'
import { TutorialModal } from '../components/TutorialModal'
import { InlineRanking } from '../components/InlineRanking'
import { colors, fontSize, spacing, fontWeight } from '../design_token'
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

function getLastPlayedLevel(): Level {
  const stored = localStorage.getItem('lastPlayedLevel')
  if (stored === 'easy' || stored === 'normal' || stored === 'hard') return stored
  return 'easy'
}

export const Start = () => {
  const navigate = useNavigate()
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const lastLevel = getLastPlayedLevel()

  return (
    <Container>
      <HelpButtonWrapper>
        <IconButton icon="help" onClick={() => setIsTutorialOpen(true)} />
      </HelpButtonWrapper>
      <Title>VED Reconstruction</Title>
      <Subtitle>波動関数を組み合わせて電子密度を再構成しよう</Subtitle>
      <PrimaryButton onClick={() => navigate('/level-select')}>
        スタート
      </PrimaryButton>
      <InlineRanking initialLevel={lastLevel} showLevelTabs />
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </Container>
  )
}
