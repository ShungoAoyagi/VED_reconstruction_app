import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'number'] }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: '名前 (10文字以内)'
  }
}

export const WithError: Story = {
  args: {
    placeholder: '名前 (10文字以内)',
    value: 'とても長い名前を入力しています',
    error: '10文字以内で入力してください'
  }
}

export const NumberInput: Story = {
  args: {
    type: 'number',
    min: 1,
    max: 4,
    step: 0.1,
    value: 2.5
  }
}

const InteractiveDemo = () => {
  const [value, setValue] = useState('')
  const error = value.length > 10 ? '10文字以内で入力してください' : undefined
  return (
    <div style={{ width: 300 }}>
      <Input
        placeholder="名前 (10文字以内)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={error}
        maxLength={20}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />
}
