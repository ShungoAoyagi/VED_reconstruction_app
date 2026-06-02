import styled from 'styled-components'
import { fontWeight } from '../design_token'
import { levelColors, levelLabels, levelDescriptions, levelRoughDescriptions } from '../const/level'
import type { Level } from '../types'

const C = {
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  textSub: '#8B949E'
} as const

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 580px;
`

const Tabs = styled.div`
  display: flex;
  gap: 8px;
`

const Tab = styled.button<{ $selected: boolean; $color: string }>`
  padding: 6px 18px;
  border-radius: 999px;
  width: 150px;
  font-size: 0.95rem;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;
  transition: all 0.15s ease;
  border: 2px solid ${({ $color }) => $color};
  background: ${({ $selected, $color }) => ($selected ? $color : 'transparent')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : C.textSub)};

  &:hover {
    background: ${({ $color }) => $color};
    color: #ffffff;
    opacity: 0.9;
  }
`

const DescriptionBox = styled.div`
  /*background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 12px;*/
  padding: 14px 28px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const RoughDescription = styled.p`
  font-size: 1rem;
  color: #e6edf3;
  white-space: pre-line;
  line-height: 1.5;
  text-align: center;
`

const DetailDescription = styled.p`
  font-size: 0.9rem;
  color: ${C.textSub};
  white-space: pre-line;
  line-height: 1.6;
  text-align: center;
`

type Props = {
  selectedLevel: Level
  onSelectLevel: (level: Level) => void
}

export const LevelSelector = ({ selectedLevel, onSelectLevel }: Props) => {
  return (
    <Wrapper>
      <Tabs>
        {(['easy', 'normal', 'hard'] as const).map((level) => (
          <Tab
            key={level}
            $selected={selectedLevel === level}
            $color={levelColors[level]}
            onClick={() => onSelectLevel(level)}
          >
            {levelLabels[level]}
          </Tab>
        ))}
      </Tabs>
      <DescriptionBox>
        <RoughDescription>{levelRoughDescriptions[selectedLevel]}</RoughDescription>
        <DetailDescription>{levelDescriptions[selectedLevel]}</DetailDescription>
      </DescriptionBox>
    </Wrapper>
  )
}
