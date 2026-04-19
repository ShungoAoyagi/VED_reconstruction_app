import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButton } from "../components/PrimaryButton";
import { IconButton } from "../components/IconButton";
import { SelectButton } from "../components/SelectButton";
import { TutorialModal } from "../components/TutorialModal";
import { api } from "../api/client";
import { colors, fontSize, spacing, fontWeight } from "../design_token";
import type { Level } from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing["2xl"]};
`;

const Header = styled.div`
  position: fixed;
  top: ${spacing.lg};
  left: ${spacing.lg};
  right: ${spacing.lg};
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: ${fontSize["3xl"]};
  font-weight: ${fontWeight.bold};
  color: ${colors.text};
  padding-bottom: ${spacing["2xl"]};
`;

const LevelGrid = styled.div`
  display: flex;
  gap: ${spacing.lg};
  padding-bottom: ${spacing["2xl"]};
`;

const LevelCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
`;

const LevelDescription = styled.p`
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  text-align: center;
  max-width: 160px;
  white-space: pre-line;
`;

const ErrorText = styled.p`
  font-size: ${fontSize.sm};
  color: ${colors.error};
  padding-bottom: ${spacing.sm};
`;

const levelDescriptions: Record<Level, string> = {
  easy: "係数を選択\n制限時間: 2分\n3回まで解答可能",
  normal: "係数と位相を選択\n制限時間: 3分\n5回まで解答可能",
  hard: "係数と位相を入力\n制限時間: 3分\n5回まで解答可能",
};

const levelLabels: Record<Level, string> = {
  easy: "かんたん",
  normal: "ふつう",
  hard: "むずかしい",
};

export const LevelSelect = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const handleStart = async () => {
    if (!selectedLevel) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await api.startGame(selectedLevel);
      navigate("/playing", {
        state: {
          level: selectedLevel,
          gameData: response,
        },
      });
    } catch (e) {
      setError("サーバーとの通信に失敗しました。再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <IconButton icon="back" onClick={() => navigate("/")} />
        <IconButton icon="help" onClick={() => setIsTutorialOpen(true)} />
      </Header>
      <Title>レベル選択</Title>
      <LevelGrid>
        {(["easy", "normal", "hard"] as const).map((level) => (
          <LevelCard key={level}>
            <SelectButton
              selected={selectedLevel === level}
              onSelect={() => setSelectedLevel(level)}
            >
              {levelLabels[level]}
            </SelectButton>
            <LevelDescription>
              {levelDescriptions[level]}
            </LevelDescription>
          </LevelCard>
        ))}
      </LevelGrid>
      {error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton
        onClick={handleStart}
        disabled={!selectedLevel || isLoading}
      >
        {isLoading ? "読み込み中..." : "ゲーム開始"}
      </PrimaryButton>
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </Container>
  );
};
