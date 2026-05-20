import type { Preview } from '@storybook/react-vite'
import '../src/renderer/src/assets/main.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#F9FAFB' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'dark', value: '#1F2937' }
      ]
    }
  }
}

export default preview
