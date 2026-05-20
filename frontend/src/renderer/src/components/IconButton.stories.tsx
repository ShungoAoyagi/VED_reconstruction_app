import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['close', 'help', 'back']
    }
  }
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Close: Story = {
  args: { icon: 'close' }
}

export const Help: Story = {
  args: { icon: 'help' }
}

export const Back: Story = {
  args: { icon: 'back' }
}

export const AllIcons: Story = {
  args: {
    icon: 'back'
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton icon="back" />
      <IconButton icon="help" />
      <IconButton icon="close" />
    </div>
  )
}
