import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import { Input } from '../input';

const meta = {
  title: 'Atoms/Form',
  component: Form,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<{ children: React.ReactNode }>;

const formSchema = z.object({
  username: z.string().min(2, '사용자명은 2자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
});

export const Default: Story = {
  render: () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { username: '', email: '' },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      alert(`제출됨: ${JSON.stringify(values)}`);
    };

    return (
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자명</FormLabel>
              <FormControl>
                <Input placeholder="사용자명을 입력하세요" {...field} />
              </FormControl>
              <FormDescription>공개적으로 표시될 이름입니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          제출
        </Button>
      </Form>
    );
  },
};

export const WithErrors: Story = {
  render: () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { username: 'a', email: 'invalid-email' },
    });

    form.trigger();

    return (
      <Form form={form} className="w-[350px] space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자명</FormLabel>
              <FormControl>
                <Input placeholder="사용자명을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          제출
        </Button>
      </Form>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    const passwordSchema = z.object({
      password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
        .regex(/[A-Z]/, '대문자를 포함해야 합니다.')
        .regex(/[0-9]/, '숫자를 포함해야 합니다.'),
    });

    const form = useForm<z.infer<typeof passwordSchema>>({
      resolver: zodResolver(passwordSchema),
      defaultValues: { password: '' },
    });

    return (
      <Form form={form} className="w-[350px] space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
              </FormControl>
              <FormDescription>8자 이상, 대문자와 숫자를 포함해야 합니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          설정
        </Button>
      </Form>
    );
  },
};
