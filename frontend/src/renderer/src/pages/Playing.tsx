import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PrimaryButton } from '../components/PrimaryButton'
import { IconButton } from '../components/IconButton'
import { SelectButton } from '../components/SelectButton'
import { Input } from '../components/Input'
import { VolumeViewer } from '../components/VolumeViewer'
import { TutorialModal } from '../components/TutorialModal'
import { useTimer } from '../hooks/useTimer'
import { api } from '../api/client'
import { colors, fontSize, spacing, fontWeight, borderRadius } from '../design_token'
import type { Level, StartGameResponse, WaveFuncProps } from '../types'

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

type LocationState = {
  level: Level
  gameData: StartGameResponse
}

export const Playing = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LocationState | undefined

  const [waveFuncStates, setWaveFuncStates] = useState<WaveFuncState[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [showTimeUp, setShowTimeUp] = useState(false)
  const [answerCount, setAnswerCount] = useState(0)
  const [highestScore, setHighestScore] = useState(0)
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [lastDensity, setLastDensity] = useState<number[] | null>(null)
  const [inRanking, setInRanking] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraState, setCameraState] = useState({
    azimuth: 0.78,
    polar: 1.0,
    distance: 25
  })

  useEffect(() => {
    if (!locationState) {
      navigate('/level-select')
      return
    }
    localStorage.setItem('lastPlayedLevel', locationState.level)
  }, [locationState, navigate])

  if (!locationState) return null

  const { level, gameData } = locationState
  const wfList = gameData.wave_function_property_list
  const targetDensity = gameData.target_electron_density
  const startTime = gameData.start_time
  const limitSeconds = gameData.limit_seconds
  const maxAnswerNum = gameData.max_answer_num

  const { remainingSeconds, isExpired } = useTimer(startTime, limitSeconds)

  if (waveFuncStates.length === 0 && wfList.length > 0) {
    setWaveFuncStates(
      wfList.map((wf, i) => ({
        amplitude: i === 0 ? 2 : (wf.possible_amplitude_list[0] ?? 1),
        phase: i === 0 ? wf.phase : 0
      }))
    )
  }

  if (isExpired && !showTimeUp) {
    setShowTimeUp(true)
  }

  const handleAmplitudeChange = (index: number, value: number) => {
    setWaveFuncStates((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], amplitude: value }
      return next
    })
  }

  const handlePhaseChange = (index: number, value: number) => {
    setWaveFuncStates((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], phase: value }
      return next
    })
  }

  const buildWaveFuncProps = (): WaveFuncProps[] =>
    wfList.map((wf, i) => ({
      ell: wf.ell,
      m: wf.m,
      amplitude: i === 0 ? 2 : waveFuncStates[i]?.amplitude ?? 1,
      phase: i === 0 ? wf.phase : waveFuncStates[i]?.phase ?? 0
    }))

  const handleSubmitAnswer = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const props = buildWaveFuncProps()
      const result = await api.submitAnswer(props)

      setAnswerCount(result.answer_num)
      setHighestScore(result.now_highest_score)
      setLastScore(result.now_score)
      setLastDensity(result.now_electron_density)
      setInRanking(result.in_ranking)

      if (result.answer_num >= maxAnswerNum) {
        navigate('/result', {
          state: {
            level,
            score: result.now_highest_score,
            inRanking: result.in_ranking
          }
        })
      }
    } catch (e) {
      console.error('Failed to submit answer:', e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuit = () => {
    setShowConfirm(false)
    navigate('/level-select')
  }

  const handleTimeUpAnswer = async () => {
    await handleSubmitAnswer()
    navigate('/result', {
      state: { level, score: highestScore, inRanking }
    })
  }

  const renderControls = (wfIdx: number, isTimeUp = false) => {
    const wf = wfList[wfIdx]
    if (wfIdx === 0) return null

    return (
      <WaveFuncControl key={`${isTimeUp ? 'tu_' : ''}${wf.ell}_${wf.m}`}>
        <WaveFuncLabel>
          ψ(ℓ={wf.ell}, m={wf.m})
        </WaveFuncLabel>
        <ControlRow>
          <ControlLabel>係数:</ControlLabel>
          {wf.possible_amplitude_list.length > 0 ? (
            <SelectGroup>
              {wf.possible_amplitude_list.map((a) => (
                <SelectButton
                  key={a}
                  selected={waveFuncStates[wfIdx]?.amplitude === a}
                  onSelect={() => handleAmplitudeChange(wfIdx, a)}
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
              onChange={(e) => handleAmplitudeChange(wfIdx, Number(e.target.value))}
            />
          )}
        </ControlRow>
        {(level === 'normal' || level === 'hard') && (
          <ControlRow>
            <ControlLabel>位相:</ControlLabel>
            {wf.possible_phase_list.length > 0 ? (
              <SelectGroup>
                {wf.possible_phase_list.map((p) => (
                  <SelectButton
                    key={p}
                    selected={waveFuncStates[wfIdx]?.phase === p}
                    onSelect={() => handlePhaseChange(wfIdx, p)}
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
                onChange={(e) => handlePhaseChange(wfIdx, Number(e.target.value))}
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
        <IconButton icon="back" onClick={() => setShowConfirm(true)} />
        <TimerDisplay $isUrgent={remainingSeconds < 30}>
          {formatTime(remainingSeconds)}
        </TimerDisplay>
        <IconButton icon="help" onClick={() => setIsTutorialOpen(true)} />
      </TopBar>

      <MainContent>
        <ViewersColumn>
          <ViewerSection>
            <ViewerLabel>目標電子密度</ViewerLabel>
            <VolumeViewer
              data={targetDensity}
              cameraState={cameraState}
              onCameraChange={setCameraState}
              width={viewerSize}
              height={viewerSize}
            />
          </ViewerSection>

          {lastDensity && (
            <ViewerSection>
              <ViewerLabel>直近の回答 (スコア: {lastScore ?? '-'})</ViewerLabel>
              <VolumeViewer
                data={lastDensity}
                cameraState={cameraState}
                onCameraChange={setCameraState}
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
              <InfoLabel>直近スコア</InfoLabel>
              <LastScoreDisplay $visible={lastScore !== null}>
                {lastScore ?? '-'}
              </LastScoreDisplay>
            </InfoItem>
            <AnswerCount>
              解答: {answerCount} / {maxAnswerNum}
            </AnswerCount>
          </InfoBar>

          {wfList.map((wf, i) =>
            i === 0 ? (
              <WaveFuncControl key={`${wf.ell}_${wf.m}`}>
                <WaveFuncLabel>
                  ψ(ℓ={wf.ell}, m={wf.m}) [係数固定: 2]
                </WaveFuncLabel>
              </WaveFuncControl>
            ) : (
              renderControls(i)
            )
          )}

          <PrimaryButton
            onClick={handleSubmitAnswer}
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
            <div
              style={{
                display: 'flex',
                gap: spacing.md,
                justifyContent: 'center'
              }}
            >
              <PrimaryButton onClick={handleQuit}>はい</PrimaryButton>
              <PrimaryButton onClick={() => setShowConfirm(false)}>
                いいえ
              </PrimaryButton>
            </div>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}

      {showTimeUp && (
        <TimeUpOverlay>
          <TimeUpDialog>
            <TimeUpTitle>時間切れ！</TimeUpTitle>
            <p style={{ textAlign: 'center', color: colors.textSecondary }}>
              最後の解答を入力してください
            </p>
            {wfList.map((_, i) => renderControls(i, true))}
            <PrimaryButton onClick={handleTimeUpAnswer} disabled={isSubmitting}>
              {isSubmitting ? '送信中...' : '最終解答する'}
            </PrimaryButton>
          </TimeUpDialog>
        </TimeUpOverlay>
      )}

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </Container>
  )
}
