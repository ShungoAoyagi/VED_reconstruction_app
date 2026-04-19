import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { SelectButton } from './SelectButton'
import { api } from '../api/client'
import { colors, fontSize, spacing, fontWeight, borderRadius } from '../design_token'
import type { Level, RankingUser } from '../types'

const Wrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
`

const LevelTabs = styled.div`
  display: flex;
  gap: ${spacing.xs};
`

const RankingTable = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  width: 100%;
  overflow: hidden;
  border: 1px solid ${colors.border};
`

const RankingRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const RankNumber = styled.span<{ $rank: number }>`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.bold};
  min-width: 2rem;
  color: ${({ $rank }) =>
    $rank === 1
      ? colors.ranking.gold
      : $rank === 2
        ? colors.ranking.silver
        : $rank === 3
          ? colors.ranking.bronze
          : colors.textSecondary};
`

const Username = styled.span`
  flex: 1;
  font-size: ${fontSize.sm};
  color: ${colors.text};
`

const Score = styled.span`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.primary};
`

const EmptyMessage = styled.p`
  text-align: center;
  color: ${colors.textSecondary};
  padding: ${spacing.md};
  font-size: ${fontSize.sm};
`

const Title = styled.p`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text};
`

const levelLabels: Record<Level, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'むずかしい'
}

type Props = {
  initialLevel?: Level
  showLevelTabs?: boolean
}

export const InlineRanking = ({ initialLevel = 'easy', showLevelTabs = true }: Props) => {
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
      <Title>ランキング</Title>
      {showLevelTabs && (
        <LevelTabs>
          {(['easy', 'normal', 'hard'] as const).map((level) => (
            <SelectButton
              key={level}
              selected={selectedLevel === level}
              onSelect={() => setSelectedLevel(level)}
            >
              {levelLabels[level]}
            </SelectButton>
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
            <RankingRow key={user.rank}>
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
