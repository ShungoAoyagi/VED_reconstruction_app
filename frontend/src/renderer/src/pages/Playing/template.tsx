import styled from 'styled-components'
import { PrimaryButton } from '../../components/PrimaryButton'
import { IconButton } from '../../components/IconButton'
import { SelectButton } from '../../components/SelectButton'
import { Input } from '../../components/Input'
import { VolumeViewer } from '../../components/VolumeViewer'
import { TutorialModal } from '../../components/TutorialModal'
import { colors, fontSize, spacing, fontWeight, borderRadius } from '../../design_token'
import type { Level, WaveFunctionProperty } from '../../types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing.lg};
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${spacing.md};
`

const TimerDisplay = styled.div<{ $isUrgent: boolean }>`
  font-size: ${fontSize['2xl']};
  font-weight: ${fontWeight.bold};
  color: ${({ $isUrgent }) => ($isUrgent ? colors.error : colors.text)};
  font-variant-numeric: tabular-nums;
`

const MainContent = styled.div`
  display: flex;
  gap: ${spacing.lg};
  flex: 1;
`

const ViewersColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`

const ViewerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`

const ViewerLabel = styled.p`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textSecondary};
  text-align: center;
`

const ControlSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`

const WaveFuncControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.border};
`

const WaveFuncLabel = styled.p`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text};
`

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`

const ControlLabel = styled.span`
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  min-width: 3rem;
`

const SelectGroup = styled.div`
  display: flex;
  gap: ${spacing.xs};
`

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md};
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.border};
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InfoLabel = styled.span`
  font-size: ${fontSize.xs};
  color: ${colors.textSecondary};
`

const ScoreDisplay = styled.span`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.bold};
  color: ${colors.primary};
`

const LastScoreDisplay = styled.span<{ $visible: boolean }>`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.bold};
  color: ${colors.success};
  opacity: ${({ $visible }) => ($visible ? 1 : 0.3)};
`

const AnswerCount = styled.span`
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
`

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

const ConfirmDialog = styled.div`
  background: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`

const TimeUpOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`

const TimeUpDialog = styled.div`
  background: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.xl};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  max-width: 600px;
  width: 90%;
`

const TimeUpTitle = styled.h3`
  font-size: ${fontSize['2xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.error};
  text-align: center;
`

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

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
  const renderControls = (wfIdx: number, isTimeUp = false) => {
    const wf = wfList[wfIdx]
    if (wfIdx === 0) return null

    return (
      <WaveFuncControl key={`${isTimeUp ? 'tu_' : ''}${wf.ell}_${wf.m}`}>
        <WaveFuncLabel>
          ψ(ℓ={wf.ell}, m={wf.m})
        </WaveFuncLabel>
        <ControlRow>
          <ControlLabel>大きさ:</ControlLabel>
          {wf.possible_amplitude_list.length > 0 ? (
            <SelectGroup>
              {wf.possible_amplitude_list.map((a) => (
                <SelectButton
                  key={a}
                  selected={waveFuncStates[wfIdx]?.amplitude === a}
                  onSelect={() => onAmplitudeChange(wfIdx, a)}
                >
                  {a}
                </SelectButton>
              ))}
            </SelectGroup>
          ) : (
            <Input
              type="number"
              min={wf.amplitude_min}
              max={wf.amplitude_max}
              step={0.1}
              value={waveFuncStates[wfIdx]?.amplitude ?? 1}
              onChange={(e) => onAmplitudeChange(wfIdx, Number(e.target.value))}
            />
          )}
        </ControlRow>
        {(level === 'normal' || level === 'hard') && (
          <ControlRow>
            <ControlLabel>角度:</ControlLabel>
            {wf.possible_phase_list.length > 0 ? (
              <SelectGroup>
                {wf.possible_phase_list.map((p) => (
                  <SelectButton
                    key={p}
                    selected={waveFuncStates[wfIdx]?.phase === p}
                    onSelect={() => onPhaseChange(wfIdx, p)}
                  >
                    {p}°
                  </SelectButton>
                ))}
              </SelectGroup>
            ) : (
              <Input
                type="number"
                min={0}
                max={360}
                step={1}
                value={waveFuncStates[wfIdx]?.phase ?? 0}
                onChange={(e) => onPhaseChange(wfIdx, Number(e.target.value))}
              />
            )}
          </ControlRow>
        )}
      </WaveFuncControl>
    )
  }

  const viewerSize = lastDensity ? 280 : 350

  return (
    <Container>
      <TopBar>
        <IconButton icon="back" onClick={onOpenConfirm} />
        <TimerDisplay $isUrgent={remainingSeconds < 30}>
          {formatTime(remainingSeconds)}
        </TimerDisplay>
        <IconButton icon="help" onClick={onOpenTutorial} />
      </TopBar>

      <MainContent>
        <ViewersColumn>
          <ViewerSection>
            <ViewerLabel>目標</ViewerLabel>
            <VolumeViewer
              data={targetDensity}
              cameraState={cameraState}
              onCameraChange={onCameraChange}
              width={viewerSize}
              height={viewerSize}
            />
          </ViewerSection>

          {lastDensity && (
            <ViewerSection>
              <ViewerLabel>現在の回答 (スコア: {lastScore ?? '-'})</ViewerLabel>
              <VolumeViewer
                data={lastDensity}
                cameraState={cameraState}
                onCameraChange={onCameraChange}
                width={viewerSize}
                height={viewerSize}
                color="#10B981"
              />
            </ViewerSection>
          )}
        </ViewersColumn>

        <ControlSection>
          <InfoBar>
            <InfoItem>
              <InfoLabel>最高スコア</InfoLabel>
              <ScoreDisplay>{highestScore}</ScoreDisplay>
            </InfoItem>
            <InfoItem>
              <InfoLabel>現在のスコア</InfoLabel>
              <LastScoreDisplay $visible={lastScore !== null}>{lastScore ?? '-'}</LastScoreDisplay>
            </InfoItem>
            <AnswerCount>
              解答回数: {answerCount} / {maxAnswerNum}
            </AnswerCount>
          </InfoBar>

          {wfList.map((wf, i) =>
            i === 0 ? (
              <WaveFuncControl key={`${wf.ell}_${wf.m}`}>
                <WaveFuncLabel>
                  ψ(ℓ={wf.ell}, m={wf.m}) [大きさ固定: 2]
                </WaveFuncLabel>
              </WaveFuncControl>
            ) : (
              renderControls(i)
            )
          )}

          <PrimaryButton
            onClick={onSubmitAnswer}
            disabled={answerCount >= maxAnswerNum || isSubmitting}
          >
            {isSubmitting ? '送信中...' : '解答する'}
          </PrimaryButton>
        </ControlSection>
      </MainContent>

      {showConfirm && (
        <ConfirmOverlay>
          <ConfirmDialog>
            <p>ゲームを中止しますか？</p>
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
              <PrimaryButton onClick={onQuit}>はい</PrimaryButton>
              <PrimaryButton onClick={onCloseConfirm}>いいえ</PrimaryButton>
            </div>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}

      {showTimeUp && (
        <TimeUpOverlay>
          <TimeUpDialog>
            <TimeUpTitle>時間切れ！</TimeUpTitle>
            <p style={{ textAlign: 'center', color: colors.textSecondary }}>解答を入力してね</p>
            {wfList.map((_, i) => renderControls(i, true))}
            <PrimaryButton onClick={onTimeUpAnswer} disabled={isSubmitting}>
              {isSubmitting ? '送信中...' : '解答する'}
            </PrimaryButton>
          </TimeUpDialog>
        </TimeUpOverlay>
      )}

      <TutorialModal isOpen={isTutorialOpen} onClose={onCloseTutorial} />
    </Container>
  )
}
