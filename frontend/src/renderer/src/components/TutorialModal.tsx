import { useState, useMemo } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { VolumeViewer } from './VolumeViewer'
import { spacing, fontWeight } from '../design_token'
import { GRID_SIZE, TOTAL_GRID_POINTS } from '../constants'

type TutorialModalProps = {
  isOpen: boolean
  onClose: () => void
}

const C = {
  bg: '#0D1117',
  card: '#161D2B',
  cardInner: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  text: '#E6EDF3',
  textSub: '#8B949E',
  accent: '#6366F1',
  accentBlue: '#3B82F6',
  viewerBg: '#090D16'
} as const

const modalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    position: 'relative',
    inset: 'auto',
    maxWidth: '720px',
    width: '90%',
    maxHeight: '85vh',
    overflow: 'auto',
    borderRadius: '1.25rem',
    padding: spacing.xl,
    border: `1px solid ${C.border}`,
    background: C.card,
    color: C.text,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
  }
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid ${C.border};
`

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: ${fontWeight.bold};
  color: ${C.text};
  letter-spacing: 0.02em;
`

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${C.border};
  border-radius: 999px;
  color: ${C.textSub};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.5);
    color: #818cf8;
  }
`

const Section = styled.div`
  margin-bottom: ${spacing.lg};
`

const SectionTitle = styled.h4`
  font-size: 0.78rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.accent};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: ${spacing.sm};
`

const Description = styled.p`
  font-size: 0.9rem;
  color: ${C.textSub};
  line-height: 1.7;
`

const LevelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const LevelRow = styled.div<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  color: ${C.textSub};
  line-height: 1.5;
`

const LevelBadge = styled.span<{ $color: string }>`
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: ${fontWeight.bold};
  color: #fff;
  background: ${({ $color }) => $color};
  padding: 2px 10px;
  border-radius: 999px;
  margin-top: 1px;
`

const InteractiveSection = styled.div`
  display: flex;
  gap: ${spacing.lg};
  align-items: center;
  padding: ${spacing.lg};
  background: ${C.cardInner};
  border: 1px solid ${C.border};
  border-radius: 0.75rem;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  flex: 1;
`

const SliderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const SliderLabel = styled.label`
  font-size: 0.82rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.textSub};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const SliderValue = styled.span`
  font-size: 0.88rem;
  font-weight: ${fontWeight.bold};
  color: #818cf8;
  font-variant-numeric: tabular-nums;
`

const StyledSlider = styled.input<{ $pct: number }>`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  background: ${({ $pct }) =>
    `linear-gradient(to right, #6366F1 0%, #6366F1 ${$pct}%, rgba(99,102,241,0.2) ${$pct}%, rgba(99,102,241,0.2) 100%)`};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #6366f1;
    border: 2px solid #c7d2fe;
    box-shadow: 0 0 6px rgba(99, 102, 241, 0.5);
  }
`

const generateDemoData = (
  c1: number,
  c2: number,
  phi1Deg: number,
  phi2Deg: number
): { data: number[]; threshold: number } => {
  const center = Math.floor(GRID_SIZE / 2)

  // First pass: find normalization factors
  // ψ(l=1,m=1)  ∝ (x+iy)·exp(-r/a1)  →  |ψ1| = √(x²+y²)·exp(-r/a1)
  // ψ(l=2,m=-2) ∝ (x²-y²-2ixy)·exp(-r/a2)  →  |ψ2| = (x²+y²)·exp(-r/a2)
  let maxPsi1 = 0
  let maxPsi2 = 0
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const dx = x - center
        const dy = y - center
        const dz = z - center
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (r === 0) continue
        const p1 = Math.sqrt(dx * dx + dy * dy) * Math.exp(-r / 3.5)
        const p2 = (dx * dx + dy * dy) * Math.exp(-r / 4.0)
        if (p1 > maxPsi1) maxPsi1 = p1
        if (p2 > maxPsi2) maxPsi2 = p2
      }
    }
  }

  // Second pass: compute density = |c1·ψ1 + c2·ψ2|²
  const raw = new Array(TOTAL_GRID_POINTS).fill(0)
  let maxVal = 0

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const dx = x - center
        const dy = y - center
        const dz = z - center
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (r === 0) continue

        // ψ1(l=1,m=1): real=(x·exp(-r/a1)), imag=(y·exp(-r/a1))
        const e1 = Math.exp(-r / 3.5) / maxPsi1
        const psi1Re = dx * e1
        const psi1Im = dy * e1

        // ψ2(l=2,m=-2): real=((x²-y²)·exp(-r/a2)), imag=(-2xy·exp(-r/a2))
        const e2 = Math.exp(-r / 4.0) / maxPsi2
        const psi2Re = (dx * dx - dy * dy) * e2
        const psi2Im = -2 * dx * dy * e2

        // Apply phase rotation e^{iφ}·ψ
        const phi1 = (phi1Deg * Math.PI) / 180
        const phi2 = (phi2Deg * Math.PI) / 180
        const cos1 = Math.cos(phi1),
          sin1 = Math.sin(phi1)
        const cos2 = Math.cos(phi2),
          sin2 = Math.sin(phi2)

        const re = c1 * (cos1 * psi1Re - sin1 * psi1Im) + c2 * (cos2 * psi2Re - sin2 * psi2Im)
        const im = c1 * (sin1 * psi1Re + cos1 * psi1Im) + c2 * (sin2 * psi2Re + cos2 * psi2Im)
        const density = re * re + im * im

        raw[x * GRID_SIZE * GRID_SIZE + y * GRID_SIZE + z] = density
        if (density > maxVal) maxVal = density
      }
    }
  }

  return { data: raw, threshold: 2 }
}

export const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
  const [coeff1, setCoeff1] = useState(2)
  const [coeff2, setCoeff2] = useState(1)
  const [phase1, setPhase1] = useState(0)

  const { data: demoData, threshold } = useMemo(
    () => generateDemoData(coeff1, coeff2, phase1, 0),
    [coeff1, coeff2, phase1]
  )

  const pct1 = (coeff1 / 4) * 100
  const pct2 = (coeff2 / 4) * 100
  const pctPhase1 = (phase1 / 360) * 100

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} ariaHideApp={false}>
      <Header>
        <Title>遊び方</Title>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>

      <Section>
        <Description>
          目標として表示された電子密度に一致するよう、電子密度のもととなる波動関数の係数と角度を調整します。
          波動関数を足した結果の2乗が電子密度になります。
        </Description>
      </Section>

      <Section>
        <SectionTitle>難易度</SectionTitle>
        <LevelList>
          <LevelRow $color="#69C361">
            <LevelBadge $color="#69C361">普通</LevelBadge>
            係数を3択から選択。解答4回・制限2分半。
          </LevelRow>
          <LevelRow $color="#F3AE36">
            <LevelBadge $color="#F3AE36">難しい</LevelBadge>
            係数4択・角度を90°刻みで選択。解答5回・制限3分。
          </LevelRow>
          <LevelRow $color="#EB5757">
            <LevelBadge $color="#EB5757">激ムズ</LevelBadge>
            係数・角度ともに自由入力。解答5回・制限3分半。
          </LevelRow>
        </LevelList>
      </Section>

      <Section>
        <SectionTitle>試してみよう</SectionTitle>
        <Description style={{ marginBottom: spacing.md }}>
          係数と角度を変えると電子密度がどう変わるか確認してみましょう。
        </Description>
        <InteractiveSection>
          <Controls>
            <SliderRow>
              <SliderHeader>
                <SliderLabel>ψ₁ (ℓ=1, m=1) 係数</SliderLabel>
                <SliderValue>{coeff1.toFixed(1)}</SliderValue>
              </SliderHeader>
              <StyledSlider
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={coeff1}
                $pct={pct1}
                onChange={(e) => setCoeff1(Number(e.target.value))}
              />
            </SliderRow>
            <SliderRow>
              <SliderHeader>
                <SliderLabel>ψ₁ 角度</SliderLabel>
                <SliderValue>{phase1}°</SliderValue>
              </SliderHeader>
              <StyledSlider
                type="range"
                min={0}
                max={360}
                step={10}
                value={phase1}
                $pct={pctPhase1}
                onChange={(e) => setPhase1(Number(e.target.value))}
              />
            </SliderRow>
            <SliderRow>
              <SliderHeader>
                <SliderLabel>ψ₂ (ℓ=2, m=−2) 係数</SliderLabel>
                <SliderValue>{coeff2.toFixed(1)}</SliderValue>
              </SliderHeader>
              <StyledSlider
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={coeff2}
                $pct={pct2}
                onChange={(e) => setCoeff2(Number(e.target.value))}
              />
            </SliderRow>
          </Controls>
          <VolumeViewer
            data={demoData}
            width={220}
            height={220}
            threshold={threshold}
            backgroundColor={C.viewerBg}
            cameraState={{ azimuth: Math.PI / 4, polar: Math.PI / 4, distance: 30 }}
          />
        </InteractiveSection>
      </Section>

      <Section style={{ marginBottom: 0 }}>
        <SectionTitle>スコア</SectionTitle>
        <Description>
          一致度と残り時間をもとに計算されます。正確に・素早く解くほど高スコアになります。
          上位5名がランキングに掲載されます。
        </Description>
      </Section>
    </ReactModal>
  )
}
