import React, { useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { fontWeight } from '../../../design_token'
import { VolumeViewer } from '../../../components/VolumeViewer'
import { GRID_SIZE, GRID_CENTER, TOTAL_GRID_POINTS } from '../../../constants'
import { C, SectionTitle, ExplanationText } from '../styles'

// ---- styled components ----

const DemoCard = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
`

const DemoCardTitle = styled.p`
  font-size: 0.85rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.accent};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
`

const OrbSelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`

const OrbBtn = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  font-size: 0.95rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid ${C.accent};
          color: #818cf8;
          font-weight: ${fontWeight.semibold};
        `
      : css`
          background: transparent;
          border: 1px solid ${C.border};
          color: ${C.textSub};
          &:hover {
            border-color: rgba(99, 102, 241, 0.5);
            color: ${C.text};
          }
        `}
`

const ViewerPair = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
`

const ViewerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const ViewerCaption = styled.p`
  font-size: 0.95rem;
  color: ${C.textSub};
  text-align: center;
  line-height: 1.5;
`

const ArrowLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${C.textSub};
  font-size: 1.5rem;
  padding: 0 4px;
`

const ArrowSub = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.04em;
`

const FormulaCard = styled.div`
  background: ${C.cardInner};
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 14px 20px;
  margin: 16px 0;
  font-size: 1.05rem;
  color: ${C.text};
  text-align: center;
  letter-spacing: 0.04em;
  font-style: italic;
`

const SuperRow = styled.div`
  display: flex;
  gap: 28px;
  align-items: flex-start;
  flex-wrap: wrap;
`

const SuperControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 240px;
  flex-shrink: 0;
`

const SliderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const SliderLabel = styled.label`
  font-size: 0.95rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.textSub};
`

const SliderValue = styled.span`
  font-size: 1rem;
  font-weight: ${fontWeight.semibold};
  color: #818cf8;
  font-variant-numeric: tabular-nums;
`

const DemoSlider = styled.input<{ $pct: number }>`
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

// ---- orbital computation ----

type OrbKey = 'p0' | 'd2'

const ORB_META: Record<OrbKey, { label: string }> = {
  p0: { label: 'ℓ=1, m=0' },
  d2: { label: 'ℓ=2, m=±2' }
}

const computeOrbital = (
  key: OrbKey
): { wf: number[]; density: number[]; wfThresh: number; densThresh: number } => {
  const wfRaw = new Array(TOTAL_GRID_POINTS).fill(0)
  const densRaw = new Array(TOTAL_GRID_POINTS).fill(0)
  let maxWf = 0
  let maxDens = 0

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const dx = x - GRID_CENTER
        const dy = y - GRID_CENTER
        const dz = z - GRID_CENTER
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (r === 0) continue

        const psi =
          key === 'p0' ? dz * Math.exp(-r / 3.5) : (dx * dx - dy * dy) * Math.exp(-r / 3.5)

        const dens = psi * psi
        wfRaw[x * GRID_SIZE * GRID_SIZE + y * GRID_SIZE + z] = psi
        densRaw[x * GRID_SIZE * GRID_SIZE + y * GRID_SIZE + z] = dens
        if (Math.abs(psi) > maxWf) maxWf = Math.abs(psi)
        if (dens > maxDens) maxDens = dens
      }
    }
  }

  return { wf: wfRaw, density: densRaw, wfThresh: maxWf * 0.6, densThresh: maxDens * 0.36 }
}

const computeSuper = (c1: number, c2: number): { data: number[]; threshold: number } => {
  let maxPsi1 = 0
  let maxPsi2 = 0
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const dx = x - GRID_CENTER
        const dy = y - GRID_CENTER
        const dz = z - GRID_CENTER
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (r === 0) continue
        const p1 = Math.abs(dz * Math.exp(-r / 3.5))
        const p2 = Math.abs((dx * dx - dy * dy) * Math.exp(-r / 4.5))
        if (p1 > maxPsi1) maxPsi1 = p1
        if (p2 > maxPsi2) maxPsi2 = p2
      }
    }
  }

  const raw = new Array(TOTAL_GRID_POINTS).fill(0)
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const dx = x - GRID_CENTER
        const dy = y - GRID_CENTER
        const dz = z - GRID_CENTER
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (r === 0) continue
        const psi1 = (dz * Math.exp(-r / 3.5)) / maxPsi1
        const psi2 = ((dx * dx - dy * dy) * Math.exp(-r / 4.5)) / maxPsi2
        raw[x * GRID_SIZE * GRID_SIZE + y * GRID_SIZE + z] = (c1 * psi1 + c2 * psi2) ** 2
      }
    }
  }

  return { data: raw, threshold: 1 }
}

// ---- component ----

const cam = { azimuth: Math.PI / 4, polar: Math.PI / 4, distance: 25 }

export const WaveSection = React.memo(function WaveSection(): React.ReactElement {
  const [orbKey, setOrbKey] = useState<OrbKey>('p0')
  const [c1, setC1] = useState(1)
  const [c2, setC2] = useState(1)

  const orbData = useMemo(() => computeOrbital(orbKey), [orbKey])
  const superData = useMemo(() => computeSuper(c1, c2), [c1, c2])

  return (
    <>
      <SectionTitle>波動関数と電子密度</SectionTitle>

      <ExplanationText>
        波動関数は、空間の各点で大きさと<b>位相</b>を持つ量です。
        位相とは、波でいえば「山と谷のずれ」に相当するもので、0°から360°まで値を取ります。
        軌道の可視化では、位相が 0° に近い領域を青、180° に近い領域を赤で表示しています。
      </ExplanationText>
      <ExplanationText>
        電子密度は、この波動関数の大きさの2乗にあたります。
        2乗をとることで位相の情報は失われ、電子密度は常に 0 以上の値になります。
        以下で軌道を切り替えながら、波動関数と電子密度の形の違いを確認してみてください。
      </ExplanationText>

      <DemoCard>
        <DemoCardTitle>軌道の形を見てみよう</DemoCardTitle>
        <OrbSelector>
          {(Object.keys(ORB_META) as OrbKey[]).map((k) => (
            <OrbBtn key={k} $active={orbKey === k} onClick={() => setOrbKey(k)}>
              {ORB_META[k].label}
            </OrbBtn>
          ))}
        </OrbSelector>
        <ViewerPair>
          <ViewerBox>
            <VolumeViewer
              data={orbData.wf}
              threshold={orbData.wfThresh}
              showNegative
              color="#818CF8"
              negativeColor="#FB7185"
              cameraState={cam}
              width={210}
              height={210}
              backgroundColor={C.viewerBg}
            />
            <ViewerCaption>
              波動関数 ψ<br />
              <span style={{ color: '#818CF8' }}>■</span> 負の値 &nbsp;
              <span style={{ color: '#FB7185' }}>■</span> 正の値
            </ViewerCaption>
          </ViewerBox>

          <ArrowLabel>
            →<ArrowSub>2乗</ArrowSub>
          </ArrowLabel>

          <ViewerBox>
            <VolumeViewer
              data={orbData.density}
              threshold={orbData.densThresh}
              cameraState={cam}
              width={210}
              height={210}
              backgroundColor={C.viewerBg}
            />
            <ViewerCaption>電子密度 ρ = |ψ|²</ViewerCaption>
          </ViewerBox>
        </ViewerPair>
      </DemoCard>

      <ExplanationText>
        電子密度は「電子がその場所に存在する確率の高さ」を表します。
        波動関数を2乗することで求められます。
      </ExplanationText>
      <FormulaCard>ρ(r) = |ψ(r)|²</FormulaCard>

      <ExplanationText>
        また、複数の軌道を足し合わせた波動関数を考えることもできます。係数 c₁、c₂
        の比率によって、できあがる電子密度の形が変わります。
        スライダーで係数を変えながら確かめてみてください。（ψ₁: ℓ=1, m=0、ψ₂: ℓ=2, m=±2）
      </ExplanationText>
      <FormulaCard>ρ = |c₁ψ₁ + c₂ψ₂|²</FormulaCard>

      <DemoCard>
        <DemoCardTitle>係数を変えてみよう</DemoCardTitle>
        <SuperRow>
          <SuperControls>
            <SliderBlock>
              <SliderHeader>
                <SliderLabel>c₁ （ℓ=1, m=0）</SliderLabel>
                <SliderValue>{c1.toFixed(1)}</SliderValue>
              </SliderHeader>
              <DemoSlider
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={c1}
                $pct={(c1 / 4) * 100}
                onChange={(e) => setC1(Number(e.target.value))}
              />
            </SliderBlock>
            <SliderBlock>
              <SliderHeader>
                <SliderLabel>c₂ （ℓ=2, m=±2）</SliderLabel>
                <SliderValue>{c2.toFixed(1)}</SliderValue>
              </SliderHeader>
              <DemoSlider
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={c2}
                $pct={(c2 / 4) * 100}
                onChange={(e) => setC2(Number(e.target.value))}
              />
            </SliderBlock>
          </SuperControls>

          <ViewerBox>
            <VolumeViewer
              data={superData.data}
              threshold={superData.threshold}
              cameraState={cam}
              width={260}
              height={260}
              backgroundColor={C.viewerBg}
            />
            <ViewerCaption>ρ = |c₁ψ₁ + c₂ψ₂|²</ViewerCaption>
          </ViewerBox>
        </SuperRow>
      </DemoCard>
    </>
  )
})
