import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectButton } from './SelectButton'

const meta = {
  title: 'Components/SelectButton',
  component: SelectButton,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' }
  }
} satisfies Meta<typeof SelectButton>

export default meta
type Story = StoryObj<typeof meta>

export const Unselected: Story = {
  args: {
    selected: false,
    onSelect: () => {},
    children: 'かんたん'
  }
}

export const Selected: Story = {
  args: {
    selected: true,
    onSelect: () => {},
    children: 'かんたん'
  }
}

export const Disabled: Story = {
  args: {
    selected: false,
    onSelect: () => {},
    children: 'かんたん',
    disabled: true
  }
}

const LevelSelectDemo = () => {
  const [selected, setSelected] = useState<string>('easy')
  const levels = [
    { key: 'easy', label: 'かんたん' },
    { key: 'normal', label: 'ふつう' },
    { key: 'hard', label: 'むずかしい' }
  ]
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {levels.map((l) => (
        <SelectButton
          key={l.key}
          selected={selected === l.key}
          onSelect={() => setSelected(l.key)}
        >
          {l.label}
        </SelectButton>
      ))}
    </div>
  )
}

export const LevelSelection: Story = {
  render: () => <LevelSelectDemo />
}

const AmplitudeSelectDemo = () => {
  const [selected, setSelected] = useState(1)
  const values = [1, 2, 4]
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {values.map((v) => (
        <SelectButton
          key={v}
          selected={selected === v}
          onSelect={() => setSelected(v)}
        >
          {v}
        </SelectButton>
      ))}
    </div>
  )
}

export const AmplitudeSelection: Story = {
  render: () => <AmplitudeSelectDemo />
}
