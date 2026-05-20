import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlayingTemplate } from './template'
import type { WaveFunctionProperty } from '../../types'

const mockWfList: WaveFunctionProperty[] = [
  {
    ell: 1, m: 1, phase: 0,
    possible_phase_list: [],
    amplitude: 2, amplitude_min: 1, amplitude_max: 4,
    possible_amplitude_list: [],
    wave_function: []
  },
  {
    ell: 2, m: 1, phase: 0,
    possible_phase_list: [0],
    amplitude: 1, amplitude_min: 1, amplitude_max: 4,
    possible_amplitude_list: [1, 2, 4],
    wave_function: []
  },
  {
    ell: 2, m: -2, phase: 0,
    possible_phase_list: [0],
    amplitude: 1, amplitude_min: 1, amplitude_max: 4,
    possible_amplitude_list: [1, 2, 4],
    wave_function: []
  }
]

const mockDensity = new Array(21 * 21 * 21).fill(0)

const baseArgs = {
  level: 'easy' as const,
  wfList: mockWfList,
  targetDensity: mockDensity,
  maxAnswerNum: 3,
  remainingSeconds: 95,
  waveFuncStates: [
    { amplitude: 2, phase: 0 },
    { amplitude: 1, phase: 0 },
    { amplitude: 1, phase: 0 }
  ],
  answerCount: 0,
  highestScore: 0,
  lastScore: null,
  lastDensity: null,
  isSubmitting: false,
  showConfirm: false,
  showTimeUp: false,
  isTutorialOpen: false,
  cameraState: { azimuth: 0.78, polar: 1.0, distance: 25 },
  onCameraChange: () => {},
  onAmplitudeChange: () => {},
  onPhaseChange: () => {},
  onSubmitAnswer: () => {},
  onTimeUpAnswer: () => {},
  onOpenConfirm: () => {},
  onCloseConfirm: () => {},
  onQuit: () => {},
  onOpenTutorial: () => {},
  onCloseTutorial: () => {}
}

const meta = {
  title: 'Pages/Playing',
  component: PlayingTemplate,
  tags: ['autodocs']
} satisfies Meta<typeof PlayingTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: baseArgs
}

export const WithLastAnswer: Story = {
  args: {
    ...baseArgs,
    answerCount: 1,
    highestScore: 450,
    lastScore: 450,
    lastDensity: mockDensity
  }
}

export const UrgentTimer: Story = {
  args: {
    ...baseArgs,
    remainingSeconds: 15,
    answerCount: 2
  }
}

export const ConfirmDialog: Story = {
  args: {
    ...baseArgs,
    showConfirm: true
  }
}

export const TimeUp: Story = {
  args: {
    ...baseArgs,
    remainingSeconds: 0,
    showTimeUp: true
  }
}
