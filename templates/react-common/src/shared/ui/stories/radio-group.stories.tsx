import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from '../radio-group';

const meta = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="r1" />
        <Label htmlFor="r1">옵션 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="r2" />
        <Label htmlFor="r2">옵션 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="r3" />
        <Label htmlFor="r3">옵션 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Small: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="sm1" size="sm" />
        <Label htmlFor="sm1" size="sm">
          Small 옵션 1
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="sm2" size="sm" />
        <Label htmlFor="sm2" size="sm">
          Small 옵션 2
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Medium: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="md1" size="md" />
        <Label htmlFor="md1">Medium 옵션 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="md2" size="md" />
        <Label htmlFor="md2">Medium 옵션 2</Label>
      </div>
    </RadioGroup>
  ),
};

export const Large: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="lg1" size="lg" />
        <Label htmlFor="lg1" size="lg">
          Large 옵션 1
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="lg2" size="lg" />
        <Label htmlFor="lg2" size="lg">
          Large 옵션 2
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="d1" disabled />
        <Label htmlFor="d1">비활성화 선택됨</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="d2" disabled />
        <Label htmlFor="d2">비활성화</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" className="flex flex-row gap-6">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="h1" />
        <Label htmlFor="h1">옵션 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="h2" />
        <Label htmlFor="h2">옵션 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="h3" />
        <Label htmlFor="h3">옵션 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-12">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500">SM</span>
        <RadioGroup defaultValue="sm">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="sm" size="sm" />
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500">MD</span>
        <RadioGroup defaultValue="md">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="md" size="md" />
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500">LG</span>
        <RadioGroup defaultValue="lg">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="lg" size="lg" />
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};
