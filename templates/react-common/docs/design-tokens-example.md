# 디자인 토큰 설정 가이드

프로젝트별 디자인 토큰은 `tailwind.config.ts`에서 설정합니다.
새 프로젝트 시작 시 디자이너에게 받은 토큰을 아래 형식에 맞춰 교체하세요.

## 설정 방법

### 1. 컬러 토큰

```ts
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        // 브랜드 Primary 컬러 (피그마 토큰에서 추출)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',   // 기본
          600: '#2563eb',   // hover
          700: '#1d4ed8',   // active
          800: '#1e40af',
          900: '#1e3a5f',
        },
        // 시맨틱 컬러 (상태 표현)
        semantic: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        // 그레이스케일 (텍스트, 보더, 배경)
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
};
```

### 2. 타이포그래피 토큰

```ts
fontFamily: {
  // 한글 프로젝트 기본
  sans: ['Pretendard', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
fontSize: {
  // 프로젝트 커스텀 사이즈
  'heading-1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
  'heading-2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
  'heading-3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
  'body-1': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
  'body-2': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
  caption: ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
},
```

### 3. 스페이싱 / 레이아웃 토큰

```ts
spacing: {
  // 8px 그리드 시스템
  '4.5': '1.125rem',  // 18px
  '13': '3.25rem',    // 52px
  '15': '3.75rem',    // 60px
  '18': '4.5rem',     // 72px
},
borderRadius: {
  DEFAULT: '0.5rem',  // 8px
  sm: '0.25rem',      // 4px
  lg: '0.75rem',      // 12px
},
boxShadow: {
  card: '0 1px 3px rgba(0, 0, 0, 0.08)',
  dropdown: '0 4px 12px rgba(0, 0, 0, 0.12)',
  modal: '0 8px 24px rgba(0, 0, 0, 0.16)',
},
```

### 4. 반응형 브레이크포인트

```ts
screens: {
  // PLEA 표준: 1920x1080 기준, Contents Max Area 최소 1200px
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',   // Contents Max Area
  '2xl': '1920px', // 풀 해상도
},
```

### 5. 컴포넌트에서 CSS 변수로 사용하기

CSS 변수 방식으로 토큰을 관리하면 다크모드나 테마 전환이 쉬워집니다.

```css
/* src/app/styles/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    --color-background: 0 0% 100%;
    --color-foreground: 222 47% 11%;
    --color-primary: 221 83% 53%;
    --color-primary-foreground: 210 40% 98%;
    --color-destructive: 0 84% 60%;
    --color-border: 214 32% 91%;
    --color-input: 214 32% 91%;
    --color-ring: 221 83% 53%;
    --radius: 0.5rem;
  }
}
```

```ts
// tailwind.config.ts에서 CSS 변수 참조
colors: {
  background: 'hsl(var(--color-background))',
  foreground: 'hsl(var(--color-foreground))',
  primary: {
    DEFAULT: 'hsl(var(--color-primary))',
    foreground: 'hsl(var(--color-primary-foreground))',
  },
},
```

## 체크리스트

새 프로젝트에서 디자인 토큰 세팅 시:

- [ ] 피그마에서 컬러 팔레트 추출
- [ ] `tailwind.config.ts`에 primary, semantic, gray 컬러 설정
- [ ] 폰트 패밀리 설정 (Pretendard 등)
- [ ] 기본 border-radius, shadow 설정
- [ ] 컴포넌트별 variant가 새 토큰과 맞는지 확인
- [ ] Storybook에서 시각적 확인
