import { useDirection } from '@radix-ui/react-direction';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAsRef } from './use-as-ref';
import { useLazyRef } from './use-lazy-ref';

// ========================================
// Types
// ========================================

type Direction = 'ltr' | 'rtl';

export interface ServerFile {
  url: string;
  name: string;
  size?: number;
  id?: string | number;
}

export interface FileState {
  file: File | ServerFile;
  progress: number;
  error?: string;
  status: 'idle' | 'uploading' | 'error' | 'success';
}

interface StoreState {
  files: Map<File | ServerFile, FileState>;
  dragOver: boolean;
  invalid: boolean;
}

type StoreAction =
  | { type: 'ADD_FILES'; files: (File | ServerFile)[] }
  | { type: 'SET_FILES'; files: (File | ServerFile)[] }
  | { type: 'SET_PROGRESS'; file: File | ServerFile; progress: number }
  | { type: 'SET_SUCCESS'; file: File | ServerFile }
  | { type: 'SET_ERROR'; file: File | ServerFile; error: string }
  | { type: 'REMOVE_FILE'; file: File | ServerFile }
  | { type: 'SET_DRAG_OVER'; dragOver: boolean }
  | { type: 'SET_INVALID'; invalid: boolean }
  | { type: 'CLEAR' };

interface Store {
  getState: () => StoreState;
  dispatch: (action: StoreAction) => void;
  subscribe: (listener: () => void) => () => void;
}

/**
 * 파일 업로드 훅 옵션
 *
 * @remarks
 * File 또는 ServerFile 타입을 모두 지원합니다.
 */
export interface UseFileUploadOptions {
  /**
   * 현재 선택된 파일 목록 (controlled)
   */
  value?: (File | ServerFile)[];

  /**
   * 초기 파일 목록 (uncontrolled)
   */
  defaultValue?: (File | ServerFile)[];

  /**
   * 파일 목록이 변경될 때 호출됩니다.
   *
   * @param files - 현재 파일 목록
   */
  onValueChange?: (files: (File | ServerFile)[]) => void;

  /**
   * 모든 파일이 accept 되었을 때 호출됩니다.
   *
   * @param files - accept된 파일 목록
   */
  onAccept?: (files: (File | ServerFile)[]) => void;

  /**
   * 개별 파일이 accept 되었을 때 호출됩니다.
   *
   * @param file - accept된 파일
   */
  onFileAccept?: (file: File | ServerFile) => void;

  /**
   * 파일이 reject 되었을 때 호출됩니다.
   *
   * @param file - reject된 파일
   * @param message - reject 사유 메시지
   */
  onFileReject?: (file: File | ServerFile, message: string) => void;

  /**
   * 파일 유효성 검사 함수
   *
   * @param file - 검사할 파일
   * @returns 에러 메시지를 반환하면 해당 파일은 reject됩니다.
   */
  onFileValidate?: (file: File | ServerFile) => string | null | undefined;

  /**
   * 파일 업로드 처리 함수
   *
   * @param files - 업로드할 파일 목록
   * @param options - 업로드 상태 콜백
   * @param options.onProgress - 업로드 진행률 콜백
   * @param options.onSuccess - 업로드 성공 콜백
   * @param options.onError - 업로드 실패 콜백
   *
   * @returns Promise 또는 void
   */
  onUpload?: (
    files: (File | ServerFile)[],
    options: {
      onProgress: (file: File | ServerFile, progress: number) => void;
      onSuccess: (file: File | ServerFile) => void;
      onError: (file: File | ServerFile, error: Error) => void;
    },
  ) => Promise<void> | void;

  /**
   * 허용할 파일 타입 (예: "image/*", "application/pdf")
   */
  accept?: string;

  /**
   * 업로드 가능한 최대 파일 개수
   */
  maxFiles?: number;

  /**
   * 업로드 가능한 파일 최대 크기 (bytes)
   */
  maxSize?: number;

  /**
   * 레이아웃 방향
   */
  dir?: Direction;

  /**
   * 컴포넌트 비활성화 여부
   */
  disabled?: boolean;

  /**
   * 에러 상태 여부
   */
  invalid?: boolean;
}

export interface UseFileUploadReturn {
  store: Store;
  urlCache: WeakMap<File, string>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFilesChange: (files: File[]) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isControlled: boolean;
  dir: Direction;
}

// ========================================
// Utils (Private)
// ========================================

function isServerFile(file: File | ServerFile): file is ServerFile {
  return 'url' in file && typeof file.url === 'string';
}

function isClientFile(file: File | ServerFile): file is File {
  return file instanceof File;
}

// ========================================
// Main Hook
// ========================================

/**
 * 파일 업로드 관리 Hook
 *
 * 기능:
 * - 파일 상태 관리 (Store)
 * - 파일 검증 (타입, 크기, 개수)
 * - 파일 업로드 실행
 * - URL 캐시 관리
 * - Drag & Drop 지원
 *
 * @example
 * ```tsx
 * const fileUpload = useFileUpload({
 *   value: files,
 *   onValueChange: setFiles,
 *   accept: 'image/*',
 *   maxFiles: 5,
 *   maxSize: 10 * 1024 * 1024, // 10MB
 *   onUpload: async (files, { onProgress, onSuccess, onError }) => {
 *     // 업로드 로직
 *   }
 * })
 * ```
 */
export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
  const {
    value,
    defaultValue,
    onValueChange,
    onAccept,
    onFileAccept,
    onFileReject,
    onFileValidate,
    onUpload,
    accept,
    maxFiles,
    maxSize,
    dir: dirProp,
    disabled = false,
    invalid = false,
  } = options;

  // ========================================
  // Refs & State
  // ========================================

  const dir = useDirection(dirProp);
  const listeners = useLazyRef(() => new Set<() => void>()).current;
  const files = useLazyRef<Map<File | ServerFile, FileState>>(() => new Map()).current;
  const urlCache = useLazyRef(() => new WeakMap<File, string>()).current;
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;

  const propsRef = useAsRef({
    onValueChange,
    onAccept,
    onFileAccept,
    onFileReject,
    onFileValidate,
    onUpload,
  });

  // ========================================
  // Store 관리
  // ========================================

  const store = useMemo<Store>(() => {
    let state: StoreState = {
      files,
      dragOver: false,
      invalid,
    };

    function reducer(state: StoreState, action: StoreAction): StoreState {
      switch (action.type) {
        case 'ADD_FILES': {
          for (const file of action.files) {
            files.set(file, {
              file,
              progress: isServerFile(file) ? 100 : 0,
              status: isServerFile(file) ? 'success' : 'idle',
            });
          }

          if (propsRef.current.onValueChange) {
            const fileList = Array.from(files.values()).map((fileState) => fileState.file);
            propsRef.current.onValueChange(fileList);
          }
          return { ...state, files };
        }

        case 'SET_FILES': {
          const newFileSet = new Set(action.files);
          for (const existingFile of files.keys()) {
            if (!newFileSet.has(existingFile)) {
              files.delete(existingFile);
            }
          }

          for (const file of action.files) {
            const existingState = files.get(file);
            if (!existingState) {
              files.set(file, {
                file,
                progress: isServerFile(file) ? 100 : 0,
                status: isServerFile(file) ? 'success' : 'idle',
              });
            }
          }
          return { ...state, files };
        }

        case 'SET_PROGRESS': {
          const fileState = files.get(action.file);
          if (fileState) {
            files.set(action.file, {
              ...fileState,
              progress: action.progress,
              status: 'uploading',
            });
          }
          return { ...state, files };
        }

        case 'SET_SUCCESS': {
          const fileState = files.get(action.file);
          if (fileState) {
            files.set(action.file, {
              ...fileState,
              progress: 100,
              status: 'success',
            });
          }
          return { ...state, files };
        }

        case 'SET_ERROR': {
          const fileState = files.get(action.file);
          if (fileState) {
            files.set(action.file, {
              ...fileState,
              error: action.error,
              status: 'error',
            });
          }
          return { ...state, files };
        }

        case 'REMOVE_FILE': {
          // File 객체인 경우에만 URL 정리
          if (isClientFile(action.file)) {
            const cachedUrl = urlCache.get(action.file);
            if (cachedUrl) {
              URL.revokeObjectURL(cachedUrl);
              urlCache.delete(action.file);
            }
          }

          files.delete(action.file);

          if (propsRef.current.onValueChange) {
            const fileList = Array.from(files.values()).map((fileState) => fileState.file);
            propsRef.current.onValueChange(fileList);
          }
          return { ...state, files };
        }

        case 'SET_DRAG_OVER': {
          return { ...state, dragOver: action.dragOver };
        }

        case 'SET_INVALID': {
          return { ...state, invalid: action.invalid };
        }

        case 'CLEAR': {
          for (const file of files.keys()) {
            // File 객체인 경우에만 URL 정리
            if (isClientFile(file)) {
              const cachedUrl = urlCache.get(file);
              if (cachedUrl) {
                URL.revokeObjectURL(cachedUrl);
                urlCache.delete(file);
              }
            }
          }

          files.clear();
          if (propsRef.current.onValueChange) {
            propsRef.current.onValueChange([]);
          }
          return { ...state, files, invalid: false };
        }

        default:
          return state;
      }
    }

    return {
      getState: () => state,
      dispatch: (action) => {
        state = reducer(state, action);
        for (const listener of listeners) {
          listener();
        }
      },
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
  }, [listeners, files, invalid, propsRef, urlCache]);

  // ========================================
  // Accept Types 파싱
  // ========================================

  const acceptTypes = useMemo(() => accept?.split(',').map((t) => t.trim()) ?? null, [accept]);

  // ========================================
  // Progress 관리 (최적화)
  // ========================================

  const onProgress = useLazyRef(() => {
    let frame = 0;
    return (file: File | ServerFile, progress: number) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        store.dispatch({
          type: 'SET_PROGRESS',
          file,
          progress: Math.min(Math.max(0, progress), 100),
        });
      });
    };
  }).current;

  // ========================================
  // Controlled/Uncontrolled 상태 동기화
  // ========================================

  useEffect(() => {
    if (isControlled) {
      store.dispatch({ type: 'SET_FILES', files: value });
    } else if (defaultValue && defaultValue.length > 0 && !store.getState().files.size) {
      store.dispatch({ type: 'SET_FILES', files: defaultValue });
    }
  }, [value, defaultValue, isControlled, store]);

  // ========================================
  // URL Cleanup on unmount
  // ========================================

  useEffect(
    () => () => {
      for (const file of files.keys()) {
        // File 객체인 경우에만 URL 정리
        if (isClientFile(file)) {
          const cachedUrl = urlCache.get(file);
          if (cachedUrl) {
            URL.revokeObjectURL(cachedUrl);
          }
        }
      }
    },
    [files, urlCache],
  );

  // ========================================
  // 파일 업로드 실행
  // ========================================

  const onFilesUpload = useCallback(
    async (files: (File | ServerFile)[]) => {
      // 서버 파일은 이미 업로드된 것이므로 제외하고, File 객체만 업로드
      const clientFiles = files.filter(isClientFile);

      if (clientFiles.length === 0) return;

      try {
        for (const file of clientFiles) {
          store.dispatch({ type: 'SET_PROGRESS', file, progress: 0 });
        }

        if (propsRef.current.onUpload) {
          await propsRef.current.onUpload(clientFiles, {
            onProgress,
            onSuccess: (file) => {
              store.dispatch({ type: 'SET_SUCCESS', file });
            },
            onError: (file, error) => {
              store.dispatch({
                type: 'SET_ERROR',
                file,
                error: error.message ?? 'Upload failed',
              });
            },
          });
        } else {
          for (const file of clientFiles) {
            store.dispatch({ type: 'SET_SUCCESS', file });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        for (const file of clientFiles) {
          store.dispatch({
            type: 'SET_ERROR',
            file,
            error: errorMessage,
          });
        }
      }
    },
    [store, propsRef, onProgress],
  );

  // ========================================
  // 파일 변경 핸들러 (검증 + 추가)
  // ========================================

  const onFilesChange = useCallback(
    (originalFiles: File[]) => {
      if (disabled) return;

      let filesToProcess = [...originalFiles];
      let invalid = false;

      // 1. 파일 개수 제한 검증
      if (maxFiles) {
        const currentCount = store.getState().files.size;

        // maxFiles=1이고 이미 파일이 있는 경우, 기존 파일 교체
        if (maxFiles === 1 && currentCount >= 1 && filesToProcess.length > 0) {
          // 기존 파일 삭제
          const existingFiles = Array.from(store.getState().files.keys());
          for (const existingFile of existingFiles) {
            store.dispatch({ type: 'REMOVE_FILE', file: existingFile });
          }

          // 첫 번째 파일만 사용 (나머지는 거부)
          if (filesToProcess.length > 1) {
            const rejectedFiles = filesToProcess.slice(1);
            invalid = true;
            filesToProcess = filesToProcess.slice(0, 1);

            for (const file of rejectedFiles) {
              const rejectionMessage = `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`;
              propsRef.current.onFileReject?.(file, rejectionMessage);
            }
          }
        } else {
          // 일반적인 경우: 남은 슬롯만큼만 허용
          const remainingSlotCount = Math.max(0, maxFiles - currentCount);

          if (remainingSlotCount < filesToProcess.length) {
            const rejectedFiles = filesToProcess.slice(remainingSlotCount);
            invalid = true;

            filesToProcess = filesToProcess.slice(0, remainingSlotCount);

            for (const file of rejectedFiles) {
              let rejectionMessage = `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`;

              if (propsRef.current.onFileValidate) {
                const validationMessage = propsRef.current.onFileValidate(file);
                if (validationMessage) {
                  rejectionMessage = validationMessage;
                }
              }

              propsRef.current.onFileReject?.(file, rejectionMessage);
            }
          }
        }
      }

      const acceptedFiles: File[] = [];

      // 2. 각 파일 검증
      for (const file of filesToProcess) {
        let rejected = false;
        let rejectionMessage = '';

        // 커스텀 검증
        if (propsRef.current.onFileValidate) {
          const validationMessage = propsRef.current.onFileValidate(file);
          if (validationMessage) {
            rejectionMessage = validationMessage;
            propsRef.current.onFileReject?.(file, rejectionMessage);
            rejected = true;
            invalid = true;
            continue;
          }
        }

        // 파일 타입 검증
        if (acceptTypes) {
          const fileType = file.type;
          const fileExtension = `.${file.name.split('.').pop()}`;

          if (
            !acceptTypes.some(
              (type) =>
                type === fileType ||
                type === fileExtension ||
                (type.includes('/*') && fileType.startsWith(type.replace('/*', '/'))),
            )
          ) {
            rejectionMessage = '파일 타입을 확인해주세요.';
            propsRef.current.onFileReject?.(file, rejectionMessage);
            rejected = true;
            invalid = true;
          }
        }

        // 파일 크기 검증
        if (maxSize && file.size > maxSize) {
          rejectionMessage = '파일 크기를 확인해주세요.';
          propsRef.current.onFileReject?.(file, rejectionMessage);
          rejected = true;
          invalid = true;
        }

        if (!rejected) {
          acceptedFiles.push(file);
        }
      }

      // 3. Invalid 상태 표시 (2초 후 자동 해제)
      if (invalid) {
        store.dispatch({ type: 'SET_INVALID', invalid });
        setTimeout(() => {
          store.dispatch({ type: 'SET_INVALID', invalid: false });
        }, 2000);
      }

      // 4. 승인된 파일 추가
      if (acceptedFiles.length > 0) {
        store.dispatch({ type: 'ADD_FILES', files: acceptedFiles });

        if (isControlled && propsRef.current.onValueChange) {
          const currentFiles = Array.from(store.getState().files.values()).map((f) => f.file);
          propsRef.current.onValueChange([...currentFiles]);
        }

        if (propsRef.current.onAccept) {
          propsRef.current.onAccept(acceptedFiles);
        }

        for (const file of acceptedFiles) {
          propsRef.current.onFileAccept?.(file);
        }

        if (propsRef.current.onUpload) {
          requestAnimationFrame(() => {
            onFilesUpload(acceptedFiles);
          });
        }
      }
    },
    [store, isControlled, propsRef, onFilesUpload, maxFiles, acceptTypes, maxSize, disabled],
  );

  // ========================================
  // Input Change 핸들러
  // ========================================

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      onFilesChange(files);
      event.target.value = '';
    },
    [onFilesChange],
  );

  // ========================================
  // Return
  // ========================================

  return {
    store,
    urlCache,
    inputRef,
    onFilesChange,
    onInputChange,
    isControlled,
    dir,
  };
}

// ========================================
// Helper Functions (Public Export)
// ========================================

/**
 * 서버 파일 객체 생성 헬퍼
 *
 * @example
 * ```ts
 * const serverFile = createServerFile('https://example.com/file.jpg', {
 *   id: '123',
 *   name: 'custom-name.jpg'
 * })
 * ```
 */
export function createServerFile(
  url: string,
  options?: {
    name?: string;
    id?: string | number;
    size?: number;
  },
): ServerFile {
  return {
    url,
    name: options?.name || url.split('/').pop() || 'file',
    id: options?.id,
    size: options?.size,
  };
}

/**
 * File 또는 ServerFile에서 ID 추출
 */
export function extractFileId(file: File | ServerFile): string | number | undefined {
  if (isServerFile(file)) {
    return file.id;
  }
  return undefined;
}

/**
 * ServerFile 타입 가드
 */
export { isClientFile, isServerFile };

/**
 * 파일의 고유 키 생성
 *
 * File 객체: name + lastModified 조합으로 고유성 보장
 * ServerFile: url 또는 id 사용
 *
 * @example
 * ```tsx
 * {files.map((file) => (
 *   <FileUploadItem key={getFileKey(file)} value={file}>
 *     ...
 *   </FileUploadItem>
 * ))}
 * ```
 */
export function getFileKey(file: File | ServerFile): string {
  if (isClientFile(file)) {
    // File 객체: name + lastModified로 고유성 보장
    return `${file.name}-${file.lastModified}`;
  }
  // ServerFile: id가 있으면 사용, 없으면 url 사용
  return file.id ? String(file.id) : file.url;
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환
 *
 * @example
 * ```ts
 * formatBytes(1024) // "1.0 KB"
 * formatBytes(1048576) // "1.0 MB"
 * ```
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}

/**
 * 파일 타입을 결정하는 유틸리티 함수
 *
 * @returns 파일 타입 카테고리 ('image' | 'video' | 'audio' | 'text' | 'code' | 'archive' | 'application' | 'unknown')
 */
export function getFileType(file: File | ServerFile | string): string {
  const fileName = typeof file === 'string' ? file : file.name;
  const mimeType = typeof file === 'string' ? '' : 'type' in file ? file.type : '';
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

  if (
    mimeType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)
  ) {
    return 'image';
  }

  if (
    mimeType.startsWith('video/') ||
    ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(extension)
  ) {
    return 'video';
  }

  if (
    mimeType.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(extension)
  ) {
    return 'audio';
  }

  if (mimeType.startsWith('text/') || ['txt', 'md', 'rtf', 'pdf'].includes(extension)) {
    return 'text';
  }

  if (
    [
      'html',
      'css',
      'js',
      'jsx',
      'ts',
      'tsx',
      'json',
      'xml',
      'php',
      'py',
      'rb',
      'java',
      'c',
      'cpp',
      'cs',
    ].includes(extension)
  ) {
    return 'code';
  }

  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
    return 'archive';
  }

  if (
    ['exe', 'msi', 'app', 'apk', 'deb', 'rpm'].includes(extension) ||
    mimeType.startsWith('application/')
  ) {
    return 'application';
  }

  return 'unknown';
}
