import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyIcon, EyeIcon, EyeOffIcon, MailIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupCount,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../input-group';

const meta = {
  title: 'Atoms/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupInput placeholder="텍스트를 입력하세요" />
    </InputGroup>
  ),
};

export const WithLeftIcon: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <SearchIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="검색어를 입력하세요" />
    </InputGroup>
  ),
};

export const WithRightIcon: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupInput placeholder="이메일을 입력하세요" />
      <InputGroupAddon align="inline-end">
        <MailIcon className="size-4" />
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithBothIcons: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <MailIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="이메일을 입력하세요" />
      <InputGroupAddon align="inline-end">
        <SearchIcon className="size-4" />
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <InputGroup className="w-[300px]">
        <InputGroupInput
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력하세요"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
  },
};

export const WithCopyButton: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupInput defaultValue="https://example.com/share/abc123" readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs" variant="ghost">
          <CopyIcon className="size-4" />
          복사
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithTextLabel: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="도메인을 입력하세요" />
    </InputGroup>
  ),
};

export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <InputGroup className="w-[300px]">
        <InputGroupInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="내용을 입력하세요"
          maxLength={100}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupCount value={value} maxLength={100} />
        </InputGroupAddon>
      </InputGroup>
    );
  },
};

export const WithTextarea: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <InputGroup className="w-[400px]">
        <InputGroupTextarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={4}
          maxLength={500}
        />
        <InputGroupAddon align="block-end">
          <InputGroupCount value={value} maxLength={500} />
        </InputGroupAddon>
      </InputGroup>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <InputGroup className="w-[300px]" errorMessage="올바른 이메일 형식이 아닙니다.">
      <InputGroupAddon align="inline-start">
        <MailIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="이메일을 입력하세요" aria-invalid="true" />
    </InputGroup>
  ),
};

export const GrayBackground: Story = {
  render: () => (
    <InputGroup className="w-[300px]" bg="gray">
      <InputGroupAddon align="inline-start">
        <SearchIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="검색어를 입력하세요" />
    </InputGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <MailIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="비활성화된 입력" disabled />
    </InputGroup>
  ),
};
