import type { Meta, StoryObj } from '@storybook/react-vite'
import { InlineRanking } from './InlineRanking'

const meta = {
  title: 'Components/InlineRanking',
  component: InlineRanking,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ランキングのインライン表示。APIからデータを取得するため、バックエンドが起動していない場合は空表示になります。'
      }
    }
  }
} satisfies Meta<typeof InlineRanking>

export default meta
type Story = StoryObj<typeof meta>

export const WithLevelTabs: Story = {
  args: {
    initialLevel: 'easy',
    showLevelTabs: true
  }
}

export const FixedLevel: Story = {
  args: {
    initialLevel: 'normal',
    showLevelTabs: false
  }
}
