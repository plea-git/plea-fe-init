import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerRange } from '../../components/calendar/datepickerRange';

const meta = {
  title: 'Atoms/DatePickerRange',
  component: DatePickerRange,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePickerRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    startDate: '2026.04.01',
    endDate: '2026.04.30',
    onChangeStart: (val) => console.log('start', val),
    onChangeEnd: (val) => console.log('end', val),
  },
};
