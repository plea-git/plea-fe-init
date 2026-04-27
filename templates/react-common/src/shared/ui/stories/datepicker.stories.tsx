import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { DatePicker } from '../datepicker';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../form';

const meta = {
  title: 'Atoms/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'YYYY.MM.DD',
    className: 'w-[200px]',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'YYYY.MM.DD',
    status: 'error',
    errorMessage: '올바른 날짜 형식이 아닙니다.',
    className: 'w-[200px]',
  },
};

export const ErrorWithoutMessage: Story = {
  args: {
    placeholder: 'YYYY.MM.DD',
    status: 'error',
    errorMessage: '에러 메시지',
    showErrorMessage: false,
    className: 'w-[200px]',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'YYYY.MM.DD',
    disabled: true,
    className: 'w-[200px]',
  },
};

export const DateDisabled: Story = {
  args: {
    placeholder: 'YYYY.MM.DD',
    className: 'w-[200px]',
    dateDisabled: (data) => data.getDate() === 1,
  },
};

export const DefaultDate: Story = {
  args: {
    placeholder: 'YYYY.MM.DD',
    className: 'w-[200px]',
    defaultDate: new Date('2026-03-01'),
  },
};

export const ControlledDatePicker = () => {
  const form = useForm();
  console.log('controlled datepicker', form.watch());
  return (
    <Form form={form}>
      <FormField
        control={form.control}
        name="start_dt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>시작 일자</FormLabel>
            <FormControl>
              <DatePicker
                {...field}
                placeholder="YYYY.MM.DD"
                value={field.value}
                defaultDate={new Date('2026-03-01')}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};
