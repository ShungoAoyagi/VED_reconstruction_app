import type { Meta, StoryObj } from '@storybook/react-vite'
import { LevelSelectTemplate } from './template'

const meta = {
  title: 'Pages/LevelSelectTemplate',
  component: LevelSelectTemplate,
  tags: ['autodocs']
} satisfies Meta<typeof LevelSelectTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    navigate: () => {},
    isTutorialOpen: false,
    setIsTutorialOpen: () => {},
    error: '',
    handleStart: () => {},
    isLoading: false,
    selectedLevel: null,
    setSelectedLevel: () => {}
  }
}
