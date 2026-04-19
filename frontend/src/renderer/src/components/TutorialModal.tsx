import { useState, useMemo } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import { IconButton } from "./IconButton";
import { VolumeViewer } from "./VolumeViewer";
import { colors, fontSize, spacing, fontWeight, borderRadius } from "../design_token";
import { GRID_SIZE, TOTAL_GRID_POINTS } from "../constants";

type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const modalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    inset: "auto",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "85vh",
    overflow: "auto",
    borderRadius: "1rem",
    padding: spacing.xl,
    border: "none",
  },
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${spacing.lg};
`;

const Title = styled.h3`
  font-size: ${fontSize["2xl"]};
  font-weight: ${fontWeight.bold};
  color: ${colors.text};
`;

const Section = styled.div`
  padding-bottom: ${spacing.lg};
`;

const SectionTitle = styled.h4`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text};
  padding-bottom: ${spacing.sm};
`;

const Description = styled.p`
  font-size: ${fontSize.base};
  color: ${colors.textSecondary};
  line-height: 1.6;
`;

const InteractiveSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  background: ${colors.background};
  border-radius: ${borderRadius.lg};
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  width: 100%;
  max-width: 400px;
`;

const SliderLabel = styled.label`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  color: ${colors.text};
  min-width: 80px;
`;

const SliderValue = styled.span`
  font-size: ${fontSize.sm};
  color: ${colors.primary};
  font-weight: ${fontWeight.semibold};
  min-width: 30px;
  text-align: right;
`;

const generateDemoData = (c1: number, c2: number): number[] => {
  const data = new Array(TOTAL_GRID_POINTS).fill(0);
  const center = Math.floor(GRID_SIZE / 2);

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const dx = x - center;
        const dy = y - center;
        const dz = z - center;
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const psi1 = dx * Math.exp(-r / 3);
        const psi2 = dy * Math.exp(-r / 3);

        const combined = c1 * psi1 + c2 * psi2;
        const density = combined * combined;

        data[x * GRID_SIZE * GRID_SIZE + y * GRID_SIZE + z] = density;
      }
    }
  }

  return data;
};

export const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
  const [coeff1, setCoeff1] = useState(2);
  const [coeff2, setCoeff2] = useState(1);

  const demoData = useMemo(
    () => generateDemoData(coeff1, coeff2),
    [coeff1, coeff2],
  );

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      ariaHideApp={false}
    >
      <Header>
        <Title>チュートリアル</Title>
        <IconButton icon="close" onClick={onClose} />
      </Header>

      <Section>
        <SectionTitle>ゲームの遊び方</SectionTitle>
        <Description>
          このゲームでは、目標として表示された電子密度に一致するように、
          与えられた波動関数の係数（と難易度によっては位相）を調整します。
          波動関数はそれぞれ水素原子のp軌道またはd軌道で、
          それらを足し合わせた結果の2乗が電子密度になります。
        </Description>
      </Section>

      <Section>
        <SectionTitle>難易度について</SectionTitle>
        <Description>
          <strong>かんたん:</strong> 位相は固定、係数を3択から選びます（3回まで解答可能、制限時間2分）
          <br />
          <strong>ふつう:</strong> 位相も90°刻みで選択、係数は3択（5回まで解答可能、制限時間3分）
          <br />
          <strong>むずかしい:</strong> 位相・係数ともに自由入力（5回まで解答可能、制限時間3分）
        </Description>
      </Section>

      <Section>
        <SectionTitle>試してみよう</SectionTitle>
        <Description>
          2つの波動関数の係数を変えると、電子密度がどのように変化するか確認してみましょう。
        </Description>
        <InteractiveSection>
          <SliderRow>
            <SliderLabel>ψ₁ の係数:</SliderLabel>
            <input
              type="range"
              min={0}
              max={4}
              step={0.5}
              value={coeff1}
              onChange={(e) => setCoeff1(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <SliderValue>{coeff1}</SliderValue>
          </SliderRow>
          <SliderRow>
            <SliderLabel>ψ₂ の係数:</SliderLabel>
            <input
              type="range"
              min={0}
              max={4}
              step={0.5}
              value={coeff2}
              onChange={(e) => setCoeff2(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <SliderValue>{coeff2}</SliderValue>
          </SliderRow>
          <VolumeViewer
            data={demoData}
            width={300}
            height={300}
            threshold={0.01}
          />
        </InteractiveSection>
      </Section>

      <Section>
        <SectionTitle>スコアについて</SectionTitle>
        <Description>
          スコアは目標電子密度との一致度と残り時間に基づいて計算されます。
          一致度が高く、残り時間が多いほど高スコアになります。
          上位5名はランキングに掲載されます。
        </Description>
      </Section>
    </ReactModal>
  );
};
