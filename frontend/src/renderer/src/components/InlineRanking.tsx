import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { api } from '../api/client'
import { fontWeight } from '../design_token'
import type { Level, RankingUser } from '../types'
import { levelColors, levelLabels } from '../const/level'

const C = {
  bg: '#0D1117',
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  text: '#E6EDF3',
  textSub: '#8B949E',
  accent: '#6366F1',
  accentBlue: '#3B82F6',
  gold: '#F59E0B',
  silver: '#9CA3AF',
  bronze: '#D97706'
} as const

const Wrapper = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const Title = styled.p`
  font-size: 0.9rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.textSub};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const LevelTabs = styled.div`
  display: flex;
  gap: 8px;
`

const LevelTab = styled.button<{ $selected: boolean; $color: string }>`
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

const RankingTable = styled.div`
  background: ${C.card};
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  border: 1px solid ${C.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const RankingRow = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  transition: background 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  ${({ $highlighted }) =>
    $highlighted &&
    `
    background: rgba(63, 185, 80, 0.1);
    border-left: 3px solid #3FB950;
    padding-left: 13px;
  `}
`

const RankNumber = styled.span<{ $rank: number }>`
  font-size: 1.1rem;
  font-weight: ${fontWeight.bold};
  min-width: 2rem;
  color: ${({ $rank }) =>
    $rank === 1 ? C.gold : $rank === 2 ? C.silver : $rank === 3 ? C.bronze : C.textSub};
`

const Username = styled.span`
  flex: 1;
  font-size: 1rem;
  color: ${C.text};
`

const Score = styled.span`
  font-size: 1rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.accentBlue};
`

const EmptyMessage = styled.p`
  text-align: center;
  color: ${C.textSub};
  padding: 16px;
  font-size: 0.85rem;
`

type Props = {
  initialLevel?: Level
  showLevelTabs?: boolean
  highlightUsername?: string
}

export const InlineRanking = ({
  initialLevel = 'easy',
  showLevelTabs = true,
  highlightUsername
}: Props) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(initialLevel)
  const [rankings, setRankings] = useState<RankingUser[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSelectedLevel(initialLevel)
  }, [initialLevel])

  useEffect(() => {
    const fetchRanking = async () => {
      setIsLoading(true)
      try {
        const response = await api.getRanking(selectedLevel)
        setRankings(response.ranking_user_list)
      } catch {
        setRankings([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchRanking()
  }, [selectedLevel])

  return (
    <Wrapper>
      <Title>今日のランキング</Title>
      {showLevelTabs && (
        <LevelTabs>
          {(['easy', 'normal', 'hard'] as const).map((level) => (
            <LevelTab
              key={level}
              $selected={selectedLevel === level}
              $color={levelColors[level]}
              onClick={() => setSelectedLevel(level)}
            >
              {levelLabels[level]}
            </LevelTab>
          ))}
        </LevelTabs>
      )}
      <RankingTable>
        {isLoading ? (
          <EmptyMessage>読み込み中...</EmptyMessage>
        ) : rankings.length === 0 ? (
          <EmptyMessage>まだ記録がありません</EmptyMessage>
        ) : (
          rankings.map((user) => (
            <RankingRow
              key={user.rank}
              $highlighted={!!highlightUsername && user.username === highlightUsername}
            >
              <RankNumber $rank={user.rank}>{user.rank}</RankNumber>
              <Username>{user.username}</Username>
              <Score>{user.score}</Score>
            </RankingRow>
          ))
        )}
      </RankingTable>
    </Wrapper>
  )
}
