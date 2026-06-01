import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResultTemplate } from './template'

const meta = {
  title: 'Pages/Result',
  component: ResultTemplate,
  tags: ['autodocs']
} satisfies Meta<typeof ResultTemplate>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  level: 'easy' as const,
  score: 1234,
  isCorrect: false,
  elapsedSeconds: 45.3,
  inRanking: false,
  isSubmitted: false,
  isSubmitting: false,
  username: '',
  submittedUsername: '',
  nameError: '',
  rankingKey: 0,
  onUsernameChange: () => {},
  onSubmitRanking: () => {},
  onGoHome: () => {}
}

export const Default: Story = {
  args: baseArgs
}

export const Correct: Story = {
  args: {
    ...baseArgs,
    isCorrect: true,
    score: 5678
  }
}

export const InRanking: Story = {
  args: {
    ...baseArgs,
    score: 9999,
    inRanking: true
  }
}

export const Submitted: Story = {
  args: {
    ...baseArgs,
    score: 9999,
    inRanking: true,
    isSubmitted: true,
    username: 'テスト'
  }
}

export const HardLevel: Story = {
  args: {
    ...baseArgs,
    level: 'hard',
    score: 42000,
    isCorrect: false,
    elapsedSeconds: 125.7
  }
}
