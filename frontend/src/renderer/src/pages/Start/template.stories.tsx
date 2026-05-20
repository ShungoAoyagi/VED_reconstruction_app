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
    lastLevel: 'easy',
    isTutorialOpen: false,
    onOpenTutorial: () => {},
    onCloseTutorial: () => {},
    onStart: () => {}
  }
}
