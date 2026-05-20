import type { Meta, StoryObj } from '@storybook/react-vite'
import { PrimaryButton } from './PrimaryButton'

const meta = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    children: { control: 'text' }
  }
} satisfies Meta<typeof PrimaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'スタート'
  }
}

export const Disabled: Story = {
  args: {
    children: '送信中...',
    disabled: true
  }
}

export const LongText: Story = {
  args: {
    children: 'ランキングに登録する'
  }
}

export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 240 }}>
      <PrimaryButton>スタート</PrimaryButton>
      <PrimaryButton>ランキング</PrimaryButton>
      <PrimaryButton disabled>送信中...</PrimaryButton>
    </div>
  )
}
