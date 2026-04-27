import type { Meta, StoryObj } from '@storybook/react-vite';
import { WelcomeBanner } from './welcome-banner';

const meta = {
  title: 'Components/WelcomeBanner',
  component: WelcomeBanner,
  tags: ['autodocs'],
} satisfies Meta<typeof WelcomeBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
