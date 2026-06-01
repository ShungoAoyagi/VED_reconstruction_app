import { useMemo, useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { IconButton } from '../../components/IconButton'
import { VolumeViewer } from '../../components/VolumeViewer'
import { TutorialModal } from '../../components/TutorialModal'
import { spacing, fontWeight } from '../../design_token'
import { transformWaveFunction, computeBoundaryMax } from '../../utils/transformWaveFunction'
import type { Level, WaveFunctionProperty } from '../../types'

// ---- Dark science theme palette ----
const C = {
  bg: '#0D1117',
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  borderHover: 'rgba(99, 102, 241, 0.5)',
  text: '#E6EDF3',
  textSub: '#8B949E',
  accent: '#6366F1',
  accentBlue: '#3B82F6',
  accentGrad: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
  error: '#F85149',
  errorGrad: 'linear-gradient(135deg, #F85149 0%, #FB923C 100%)',
  success: '#3FB950',
  target: '#F97316',
  wavePos: '#818CF8',
  waveNeg: '#FB7185',
  viewerBg: '#090D16'
} as const

// ---- Animations ----
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`

// ---- Layout ----
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${C.bg};
  padding: ${spacing.md} ${spacing.lg};
  gap: ${spacing.md};
  box-sizing: border-box;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`

const DarkIconButton = styled(IconButton)`
  color: ${C.textSub};
  border-color: rgba(99, 102, 241, 0.28);
  background: transparent;

  &:hover {
    background-color: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.6);
    color: ${C.wavePos};
  }
`

const TimerDisplay = styled.div<{ $isUrgent: boolean }>`
  font-size: 1.75rem;
  font-weight: ${fontWeight.bold};
  color: ${({ $isUrgent }) => ($isUrgent ? C.error : C.text)};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  ${({ $isUrgent }) =>
    $isUrgent &&
    css`
      animation: ${pulse} 1s ease-in-out infinite;
    `}
`

// ---- Row 1: viewers + score ----
const Row1 = styled.div`
  display: flex;
  flex: 1;
  gap: ${spacing.md};
  align-items: stretch;
  min-height: 0;
`

const ViewerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ViewerLabel = styled.p`
  font-size: 0.9rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.textSub};
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const ViewerPlaceholder = styled.div`
  background: ${C.viewerBg};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${C.textSub};
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  border: 1px dashed rgba(99, 102, 241, 0.2);
`

const ScorePanel = styled.div`
  flex: 1;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 16px;
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${spacing.md};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const ScoreDivider = styled.div`
  width: 40px;
  height: 1px;
  background: ${C.border};
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const InfoLabel = styled.span`
  font-size: 0.82rem;
  color: ${C.textSub};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const ScoreDisplay = styled.span`
  font-size: 2rem;
  font-weight: ${fontWeight.bold};
  color: ${C.accentBlue};
  font-variant-numeric: tabular-nums;
  line-height: 1;
`

const LastScoreDisplay = styled.span<{ $visible: boolean }>`
  font-size: 2rem;
  font-weight: ${fontWeight.bold};
  color: ${C.success};
  opacity: ${({ $visible }) => ($visible ? 1 : 0.2)};
  transition: opacity 0.4s ease;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`

const AnswerCountDisplay = styled.span`
  font-size: 0.95rem;
  color: ${C.textSub};
  font-variant-numeric: tabular-nums;
  margin-top: 4px;
`

// ---- Row 2: orbital cards ----
const Row2 = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex: 1;
  min-height: 0;
`

const WaveFuncCard = styled.div`
  flex: 1;
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 16px;
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  min-height: 0;

  &:hover {
    border-color: ${C.borderHover};
    box-shadow: 0 4px 24px rgba(99, 102, 241, 0.12);
  }
`

const WaveFuncLabel = styled.p`
  font-size: 1.05rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.text};
  flex-shrink: 0;
`

const WaveViewerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`

const FixedBadge = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.wavePos};
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.28);
  border-radius: 6px;
  padding: 3px 10px;
`

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`

const ControlLabel = styled.span`
  font-size: 0.95rem;
  color: ${C.textSub};
  min-width: 3rem;
  flex-shrink: 0;
`

// ---- Slider ----
const SliderWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`

const StyledSlider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
  min-width: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ffffff;
    border: 3px solid ${C.accent};
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.45);
    cursor: pointer;
    transition:
      box-shadow 0.15s ease,
      transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    box-shadow: 0 2px 14px rgba(99, 102, 241, 0.65);
    transform: scale(1.12);
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ffffff;
    border: 3px solid ${C.accent};
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.45);
    cursor: pointer;
  }
`

const SliderValue = styled.span`
  font-size: 1rem;
  font-weight: ${fontWeight.bold};
  color: ${C.accent};
  min-width: 3.6rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`

// ---- Row 3: submit button ----
const SubmitButton = styled.button`
  width: 100%;
  background: ${C.accentGrad};
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1.05rem;
  font-weight: ${fontWeight.semibold};
  color: white;
  cursor: pointer;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.38);
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.55);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    background: linear-gradient(135deg, rgba(71, 85, 105, 0.5) 0%, rgba(51, 65, 85, 0.5) 100%);
    box-shadow: none;
    cursor: not-allowed;
    color: ${C.textSub};
  }
`

// ---- Modals ----
const DialogButton = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: 10px 28px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: 0.03em;

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background: ${C.accentGrad};
          border: none;
          color: white;
          box-shadow: 0 3px 12px rgba(99, 102, 241, 0.35);
          &:hover {
            box-shadow: 0 5px 16px rgba(99, 102, 241, 0.5);
          }
        `
      : css`
          background: transparent;
          border: 1px solid ${C.border};
          color: ${C.textSub};
          &:hover {
            border-color: ${C.borderHover};
            color: ${C.text};
          }
        `}
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
`

const Dialog = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  padding: ${spacing.xl};
  border-radius: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65);
  color: ${C.text};
  min-width: 300px;
  font-size: 1rem;
`

const TimeUpDialog = styled(Dialog)`
  max-width: 860px;
  width: 90%;
  text-align: left;
  max-height: 85vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
  }
`

const TimeUpTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: ${fontWeight.bold};
  background: ${C.errorGrad};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`

const TimeUpCardsRow = styled.div`
  display: flex;
  gap: ${spacing.md};
`

// ---- Helpers ----
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const getSliderBackground = (value: number, min: number, max: number): string => {
  const pct = max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return `linear-gradient(to right, ${C.accent} ${pct}%, rgba(71, 85, 105, 0.4) ${pct}%)`
}

// ---- Types ----
type WaveFuncState = {
  amplitude: number
  phase: number
}

type CameraState = {
  azimuth: number
  polar: number
  distance: number
}

export type PlayingTemplateProps = {
  level: Level
  wfList: WaveFunctionProperty[]
  targetDensity: number[]
  maxAnswerNum: number
  remainingSeconds: number
  waveFuncStates: WaveFuncState[]
  answerCount: number
  highestScore: number
  lastScore: number | null
  lastDensity: number[] | null
  isSubmitting: boolean
  showConfirm: boolean
  showTimeUp: boolean
  isTutorialOpen: boolean
  cameraState: CameraState
  onCameraChange: (state: CameraState) => void
  onAmplitudeChange: (index: number, value: number) => void
  onPhaseChange: (index: number, value: number) => void
  onSubmitAnswer: () => void
  onTimeUpAnswer: () => void
  onOpenConfirm: () => void
  onCloseConfirm: () => void
  onQuit: () => void
  onOpenTutorial: () => void
  onCloseTutorial: () => void
}

export const PlayingTemplate = ({
  level,
  wfList,
  targetDensity,
  maxAnswerNum,
  remainingSeconds,
  waveFuncStates,
  answerCount,
  highestScore,
  lastScore,
  lastDensity,
  isSubmitting,
  showConfirm,
  showTimeUp,
  isTutorialOpen,
  cameraState,
  onCameraChange,
  onAmplitudeChange,
  onPhaseChange,
  onSubmitAnswer,
  onTimeUpAnswer,
  onOpenConfirm,
  onCloseConfirm,
  onQuit,
  onOpenTutorial,
  onCloseTutorial
}: PlayingTemplateProps) => {
  // 各軌道の最大振幅と固定閾値（元データの境界最大値）を事前計算
  const wfMeta = useMemo(
    () =>
      wfList.map((wf, i) => ({
        boundaryMax: computeBoundaryMax(wf.wave_function),
        ampMax:
          i === 0
            ? 2
            : wf.possible_amplitude_list.length > 0
              ? Math.max(...wf.possible_amplitude_list)
              : wf.amplitude_max
      })),
    [wfList]
  )

  // ユーザー操作（phase回転 + amplitudeスケール）を反映した表示用データを生成
  const displayWaveFunctions = useMemo(
    () =>
      wfList.map((wf, i) => {
        if (wf.wave_function.length === 0) return wf.wave_function
        const state = waveFuncStates[i]
        if (!state) return wf.wave_function
        const phaseRad = (state.phase * Math.PI) / 180
        return transformWaveFunction(wf.wave_function, state.amplitude, wfMeta[i].ampMax, phaseRad)
      }),
    [wfList, waveFuncStates, wfMeta]
  )

  const row1ViewerSize = 300

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const waveViewerSize = useMemo(() => {
    const n = wfList.length
    // Container: padding lr = spacing.lg (24px) × 2 = 48px
    // Row2: gap = spacing.md (16px) × (n-1)
    // WaveFuncCard: padding lr = spacing.md (16px) × 2 × n
    const maxByWidth = Math.floor((windowWidth - 48 - 16 * (n - 1) - 32 * n) / n)
    const maxByHeight = n <= 1 ? 420 : n === 2 ? 400 : 380
    return Math.min(maxByWidth, maxByHeight)
  }, [windowWidth, wfList.length])

  const renderTimeUpCard = (wfIdx: number) => {
    const wf = wfList[wfIdx]
    const ampValue = waveFuncStates[wfIdx]?.amplitude ?? 1
    const phaseValue = waveFuncStates[wfIdx]?.phase ?? 0

    const ampMin =
      wf.possible_amplitude_list.length > 0
        ? Math.min(...wf.possible_amplitude_list)
        : wf.amplitude_min
    const ampMax =
      wf.possible_amplitude_list.length > 0
        ? Math.max(...wf.possible_amplitude_list)
        : wf.amplitude_max
    const ampStep =
      wf.possible_amplitude_list.length > 1
        ? wf.possible_amplitude_list[1] - wf.possible_amplitude_list[0]
        : 0.1

    const phaseMin = wf.possible_phase_list.length > 0 ? Math.min(...wf.possible_phase_list) : 0
    const phaseMax = wf.possible_phase_list.length > 0 ? Math.max(...wf.possible_phase_list) : 360
    const phaseStep =
      wf.possible_phase_list.length > 1 ? wf.possible_phase_list[1] - wf.possible_phase_list[0] : 1

    return (
      <WaveFuncCard key={`tu_${wf.ell}_${wf.m}`} style={{ flex: 1 }}>
        <WaveFuncLabel>
          ψ(ℓ={wf.ell}, m={wf.m})
        </WaveFuncLabel>
        {wfIdx === 0 ? (
          <FixedBadge>大きさ: 2</FixedBadge>
        ) : (
          <>
            <ControlRow>
              <ControlLabel>大きさ</ControlLabel>
              <SliderWrapper>
                <StyledSlider
                  type="range"
                  min={ampMin}
                  max={ampMax}
                  step={ampStep}
                  value={ampValue}
                  onChange={(e) => onAmplitudeChange(wfIdx, Number(e.target.value))}
                  style={{ background: getSliderBackground(ampValue, ampMin, ampMax) }}
                />
                <SliderValue>{ampValue}</SliderValue>
              </SliderWrapper>
            </ControlRow>
            {(level === 'normal' || level === 'hard') && (
              <ControlRow>
                <ControlLabel>角度</ControlLabel>
                <SliderWrapper>
                  <StyledSlider
                    type="range"
                    min={phaseMin}
                    max={phaseMax}
                    step={phaseStep}
                    value={phaseValue}
                    onChange={(e) => onPhaseChange(wfIdx, Number(e.target.value))}
                    style={{ background: getSliderBackground(phaseValue, phaseMin, phaseMax) }}
                  />
                  <SliderValue>{phaseValue}°</SliderValue>
                </SliderWrapper>
              </ControlRow>
            )}
          </>
        )}
      </WaveFuncCard>
    )
  }

  return (
    <Container>
      <TopBar>
        <DarkIconButton icon="back" onClick={onOpenConfirm} />
        <TimerDisplay $isUrgent={remainingSeconds < 10}>
          {formatTime(remainingSeconds)}
        </TimerDisplay>
        <DarkIconButton icon="help" onClick={onOpenTutorial} />
      </TopBar>

      {/* Row 1: 目標密度 / 現在の回答 / スコア */}
      <Row1>
        <ViewerSection>
          <ViewerLabel>目標の電子分布</ViewerLabel>
          <VolumeViewer
            data={targetDensity}
            cameraState={cameraState}
            onCameraChange={onCameraChange}
            width={row1ViewerSize}
            height={row1ViewerSize}
            color={C.target}
            backgroundColor={C.viewerBg}
          />
        </ViewerSection>

        <ViewerSection>
          <ViewerLabel>現在の解答{lastScore !== null ? ` — ${lastScore} pt` : ''}</ViewerLabel>
          {lastDensity ? (
            <VolumeViewer
              data={lastDensity}
              cameraState={cameraState}
              onCameraChange={onCameraChange}
              width={row1ViewerSize}
              height={row1ViewerSize}
              color={C.success}
              backgroundColor={C.viewerBg}
            />
          ) : (
            <ViewerPlaceholder style={{ width: row1ViewerSize, height: row1ViewerSize }}>
              未解答
            </ViewerPlaceholder>
          )}
        </ViewerSection>

        <ScorePanel>
          <InfoItem>
            <InfoLabel>最高スコア</InfoLabel>
            <ScoreDisplay>{highestScore}</ScoreDisplay>
          </InfoItem>
          <ScoreDivider />
          <InfoItem>
            <InfoLabel>現在のスコア</InfoLabel>
            <LastScoreDisplay $visible={lastScore !== null}>{lastScore ?? '-'}</LastScoreDisplay>
          </InfoItem>
          <AnswerCountDisplay>
            {answerCount} / {maxAnswerNum} 回
          </AnswerCountDisplay>
        </ScorePanel>
      </Row1>

      {/* Row 2: 軌道カード横並び */}
      <Row2>
        {wfList.map((wf, i) => {
          const ampValue = waveFuncStates[i]?.amplitude ?? 1
          const phaseValue = waveFuncStates[i]?.phase ?? 0

          const ampMin =
            wf.possible_amplitude_list.length > 0
              ? Math.min(...wf.possible_amplitude_list)
              : wf.amplitude_min
          const ampMax =
            wf.possible_amplitude_list.length > 0
              ? Math.max(...wf.possible_amplitude_list)
              : wf.amplitude_max
          const ampStep =
            wf.possible_amplitude_list.length > 1
              ? wf.possible_amplitude_list[1] - wf.possible_amplitude_list[0]
              : 0.1

          const phaseMin =
            wf.possible_phase_list.length > 0 ? Math.min(...wf.possible_phase_list) : 0
          const phaseMax =
            wf.possible_phase_list.length > 0 ? Math.max(...wf.possible_phase_list) : 360
          const phaseStep =
            wf.possible_phase_list.length > 1
              ? wf.possible_phase_list[1] - wf.possible_phase_list[0]
              : 1

          return (
            <WaveFuncCard key={`${wf.ell}_${wf.m}`}>
              <WaveFuncLabel>
                ψ(ℓ={wf.ell}, m={wf.m})
              </WaveFuncLabel>

              {displayWaveFunctions[i].length > 0 && (
                <WaveViewerWrapper>
                  <VolumeViewer
                    data={displayWaveFunctions[i]}
                    threshold={wfMeta[i].boundaryMax}
                    cameraState={cameraState}
                    onCameraChange={onCameraChange}
                    width={waveViewerSize}
                    height={waveViewerSize}
                    showNegative={true}
                    color={C.wavePos}
                    negativeColor={C.waveNeg}
                    backgroundColor={C.viewerBg}
                  />
                </WaveViewerWrapper>
              )}

              {i === 0 ? (
                <FixedBadge>大きさ: 2</FixedBadge>
              ) : (
                <>
                  <ControlRow>
                    <ControlLabel>大きさ</ControlLabel>
                    <SliderWrapper>
                      <StyledSlider
                        type="range"
                        min={ampMin}
                        max={ampMax}
                        step={ampStep}
                        value={ampValue}
                        onChange={(e) => onAmplitudeChange(i, Number(e.target.value))}
                        style={{ background: getSliderBackground(ampValue, ampMin, ampMax) }}
                      />
                      <SliderValue>{ampValue}</SliderValue>
                    </SliderWrapper>
                  </ControlRow>

                  {(level === 'normal' || level === 'hard') && (
                    <ControlRow>
                      <ControlLabel>角度</ControlLabel>
                      <SliderWrapper>
                        <StyledSlider
                          type="range"
                          min={phaseMin}
                          max={phaseMax}
                          step={phaseStep}
                          value={phaseValue}
                          onChange={(e) => onPhaseChange(i, Number(e.target.value))}
                          style={{
                            background: getSliderBackground(phaseValue, phaseMin, phaseMax)
                          }}
                        />
                        <SliderValue>{phaseValue}°</SliderValue>
                      </SliderWrapper>
                    </ControlRow>
                  )}
                </>
              )}
            </WaveFuncCard>
          )
        })}
      </Row2>

      {/* Row 3: 解答ボタン */}
      <SubmitButton onClick={onSubmitAnswer} disabled={answerCount >= maxAnswerNum || isSubmitting}>
        {isSubmitting ? '送信中...' : '解答する'}
      </SubmitButton>

      {showConfirm && (
        <Overlay style={{ zIndex: 100 }}>
          <Dialog>
            <p>ゲームを中止しますか？</p>
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
              <DialogButton $variant="primary" onClick={onQuit}>
                はい
              </DialogButton>
              <DialogButton $variant="ghost" onClick={onCloseConfirm}>
                いいえ
              </DialogButton>
            </div>
          </Dialog>
        </Overlay>
      )}

      {showTimeUp && (
        <Overlay style={{ zIndex: 200 }}>
          <TimeUpDialog>
            <TimeUpTitle>時間切れ！</TimeUpTitle>
            <p style={{ textAlign: 'center', color: C.textSub, fontSize: '0.95rem' }}>
              最後の解答を入力してください
            </p>
            <TimeUpCardsRow>{wfList.map((_, i) => renderTimeUpCard(i))}</TimeUpCardsRow>
            <SubmitButton onClick={onTimeUpAnswer} disabled={isSubmitting}>
              {isSubmitting ? '送信中...' : '解答する'}
            </SubmitButton>
          </TimeUpDialog>
        </Overlay>
      )}

      <TutorialModal isOpen={isTutorialOpen} onClose={onCloseTutorial} />
    </Container>
  )
}
