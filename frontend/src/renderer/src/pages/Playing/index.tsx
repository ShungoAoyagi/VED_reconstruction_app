import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PlayingTemplate } from './template'
import { useTimer } from '../../hooks/useTimer'
import { api } from '../../api/client'
import type { Level, StartGameResponse, WaveFuncProps } from '../../types'

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
    azimuth: Math.PI / 4, // x-y 面内 45°（x と y を均等に見せる）
    polar: Math.PI / 4, // z 軸から 45°（z が上、x-y が面内に見える仰角）
    distance: 50
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
        phase: i === 0 ? wf.phase : (wf.possible_phase_list[0] ?? 0)
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
      amplitude: i === 0 ? 2 : (waveFuncStates[i]?.amplitude ?? 1),
      phase: i === 0 ? wf.phase : (waveFuncStates[i]?.phase ?? 0)
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

      if (result.is_correct || result.answer_num >= maxAnswerNum) {
        navigate('/result', {
          state: {
            level,
            score: result.now_highest_score,
            inRanking: result.in_ranking,
            isCorrect: result.is_correct,
            elapsedSeconds: result.elapsed_seconds
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
      state: {
        level,
        score: highestScore,
        inRanking,
        isCorrect: false,
        elapsedSeconds: limitSeconds
      }
    })
  }

  return (
    <PlayingTemplate
      level={level}
      wfList={wfList}
      targetDensity={targetDensity}
      maxAnswerNum={maxAnswerNum}
      remainingSeconds={remainingSeconds}
      waveFuncStates={waveFuncStates}
      answerCount={answerCount}
      highestScore={highestScore}
      lastScore={lastScore}
      lastDensity={lastDensity}
      isSubmitting={isSubmitting}
      showConfirm={showConfirm}
      showTimeUp={showTimeUp}
      isTutorialOpen={isTutorialOpen}
      cameraState={cameraState}
      onCameraChange={setCameraState}
      onAmplitudeChange={handleAmplitudeChange}
      onPhaseChange={handlePhaseChange}
      onSubmitAnswer={handleSubmitAnswer}
      onTimeUpAnswer={handleTimeUpAnswer}
      onOpenConfirm={() => setShowConfirm(true)}
      onCloseConfirm={() => setShowConfirm(false)}
      onQuit={handleQuit}
      onOpenTutorial={() => setIsTutorialOpen(true)}
      onCloseTutorial={() => setIsTutorialOpen(false)}
    />
  )
}
