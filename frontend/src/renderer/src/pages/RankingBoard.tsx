import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IconButton } from "../components/IconButton";
import { SelectButton } from "../components/SelectButton";
import { api } from "../api/client";
import { colors, fontSize, spacing, fontWeight, borderRadius } from "../design_token";
import type { Level, RankingUser } from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing["2xl"]};
`;

const Header = styled.div`
  position: fixed;
  top: ${spacing.lg};
  left: ${spacing.lg};
`;

const Title = styled.h2`
  font-size: ${fontSize["3xl"]};
  font-weight: ${fontWeight.bold};
  color: ${colors.text};
  padding-bottom: ${spacing.lg};
`;

const LevelTabs = styled.div`
  display: flex;
  gap: ${spacing.sm};
  padding-bottom: ${spacing.lg};
`;

const RankingTable = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.xl};
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const RankingRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const RankNumber = styled.span<{ $rank: number }>`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.bold};
  min-width: 2.5rem;
  color: ${({ $rank }) =>
    $rank === 1
      ? colors.ranking.gold
      : $rank === 2
        ? colors.ranking.silver
        : $rank === 3
          ? colors.ranking.bronze
          : colors.textSecondary};
`;

const Username = styled.span`
  flex: 1;
  font-size: ${fontSize.base};
  color: ${colors.text};
`;

const Score = styled.span`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  color: ${colors.primary};
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${colors.textSecondary};
  padding: ${spacing.xl};
`;

const levelLabels: Record<Level, string> = {
  easy: "かんたん",
  normal: "ふつう",
  hard: "むずかしい",
};

export const RankingBoard = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRanking = async () => {
      setIsLoading(true);
      try {
        const response = await api.getRanking(selectedLevel);
        setRankings(response.ranking_user_list);
      } catch {
        setRankings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, [selectedLevel]);

  return (
    <Container>
      <Header>
        <IconButton icon="back" onClick={() => navigate("/")} />
      </Header>
      <Title>ランキング</Title>
      <LevelTabs>
        {(["easy", "normal", "hard"] as const).map((level) => (
          <SelectButton
            key={level}
            selected={selectedLevel === level}
            onSelect={() => setSelectedLevel(level)}
          >
            {levelLabels[level]}
          </SelectButton>
        ))}
      </LevelTabs>
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
    </Container>
  );
};
