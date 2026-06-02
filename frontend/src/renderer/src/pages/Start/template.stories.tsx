import type { Meta, StoryObj } from '@storybook/react-vite'
import { StartTemplate } from './template'

const meta = {
  title: 'Pages/Start',
  component: StartTemplate,
  tags: ['autodocs']
} satisfies Meta<typeof StartTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    selectedLevel: 'easy',
    onSelectLevel: () => {},
    isLoading: false,
    error: '',
    isTutorialOpen: false,
    onOpenTutorial: () => {},
    onCloseTutorial: () => {},
    onStart: () => {}
  }
}

export const NormalSelected: Story = {
  args: {
    selectedLevel: 'normal',
    onSelectLevel: () => {},
    isLoading: false,
    error: '',
    isTutorialOpen: false,
    onOpenTutorial: () => {},
    onCloseTutorial: () => {},
    onStart: () => {}
  }
}

export const Loading: Story = {
  args: {
    selectedLevel: 'hard',
    onSelectLevel: () => {},
    isLoading: true,
    error: '',
    isTutorialOpen: false,
    onOpenTutorial: () => {},
    onCloseTutorial: () => {},
    onStart: () => {}
  }
}

export const WithError: Story = {
  args: {
    selectedLevel: 'easy',
    onSelectLevel: () => {},
    isLoading: false,
    error: 'サーバーとの通信に失敗しました。再度お試しください。',
    isTutorialOpen: false,
    onOpenTutorial: () => {},
    onCloseTutorial: () => {},
    onStart: () => {}
  }
}
