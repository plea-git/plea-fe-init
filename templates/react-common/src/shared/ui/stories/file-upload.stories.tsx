import type { Meta, StoryObj } from '@storybook/react-vite';
import { UploadIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../button';
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  getFileKey,
  type ServerFile,
} from '../file-upload';

const meta = {
  title: 'Atoms/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<(File | ServerFile)[]>([]);
    return (
      <FileUpload value={files} onValueChange={setFiles} className="w-[400px]">
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className="size-8 text-gray-400" />
            <p className="text-sm text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
          </div>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={getFileKey(file)} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <XIcon className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const ImagesOnly: Story = {
  render: () => {
    const [files, setFiles] = useState<(File | ServerFile)[]>([]);
    return (
      <FileUpload value={files} onValueChange={setFiles} accept="image/*" className="w-[400px]">
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className="size-8 text-gray-400" />
            <p className="text-sm text-gray-500">이미지 파일만 업로드 가능합니다</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF</p>
          </div>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={getFileKey(file)} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <XIcon className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const MaxFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<(File | ServerFile)[]>([]);
    return (
      <FileUpload
        value={files}
        onValueChange={setFiles}
        maxFiles={3}
        multiple
        className="w-[400px]"
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className="size-8 text-gray-400" />
            <p className="text-sm text-gray-500">최대 3개 파일까지 업로드 가능</p>
          </div>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={getFileKey(file)} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <XIcon className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
        {files.length > 0 && (
          <FileUploadClear asChild>
            <Button variant="outline" size="sm">
              전체 삭제
            </Button>
          </FileUploadClear>
        )}
      </FileUpload>
    );
  },
};

export const WithTriggerButton: Story = {
  render: () => {
    const [files, setFiles] = useState<(File | ServerFile)[]>([]);
    return (
      <FileUpload value={files} onValueChange={setFiles} className="w-[400px]">
        <div className="flex items-center gap-2">
          <FileUploadTrigger asChild>
            <Button variant="outline">
              <UploadIcon className="mr-2 size-4" />
              파일 선택
            </Button>
          </FileUploadTrigger>
          <span className="text-sm text-gray-500">
            {files.length > 0 ? `${files.length}개 파일 선택됨` : '선택된 파일 없음'}
          </span>
        </div>
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem key={getFileKey(file)} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <XIcon className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <FileUpload disabled className="w-[400px]">
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-2">
          <UploadIcon className="size-8 text-gray-300" />
          <p className="text-sm text-gray-400">파일 업로드가 비활성화되었습니다</p>
        </div>
      </FileUploadDropzone>
    </FileUpload>
  ),
};
