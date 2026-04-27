import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { CalendarBox } from '../calendar';

const meta = {
  title: 'Atoms/Calendar',
  component: CalendarBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <CalendarBox mode="single" selected={date} onSelect={setDate} />;
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <CalendarBox mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />
    );
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    });
    return <CalendarBox mode="range" selected={range} onSelect={setRange} />;
  },
};

export const MultipleMonths: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return <CalendarBox mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />;
  },
};

export const HideOutsideDays: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <CalendarBox mode="single" selected={date} onSelect={setDate} showOutsideDays={false} />;
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const today = new Date();
    return (
      <CalendarBox mode="single" selected={date} onSelect={setDate} disabled={{ before: today }} />
    );
  },
};

export const WithWeekNumbers: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <CalendarBox mode="single" selected={date} onSelect={setDate} showWeekNumber />;
  },
};
