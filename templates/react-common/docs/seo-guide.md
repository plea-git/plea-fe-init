# SEO 설정 가이드

## Vite + React SPA에서의 SEO

SPA는 기본적으로 서버에서 빈 HTML을 내려주고 클라이언트에서 렌더링하므로,
검색엔진 크롤러가 콘텐츠를 인식하지 못할 수 있습니다.

### 프로젝트 유형별 전략

| 유형 | SEO 중요도 | 전략 |
|------|-----------|------|
| 관리자 페이지, SaaS 대시보드 | 낮음 | `react-helmet-async`로 메타태그만 관리 |
| 사내 시스템 | 없음 | `<meta name="robots" content="noindex">` |
| 랜딩 페이지, 마케팅 사이트 | 높음 | `vite-plugin-ssr` 또는 별도 SSR/SSG 도구 사용 |
| 블로그, 커머스 | 매우 높음 | Astro, Remix 등 SSR 프레임워크 권장 |

---

## 1. 기본 SEO (SPA용) — react-helmet-async

### 설정

```tsx
// src/app/App.tsx
import { HelmetProvider } from 'react-helmet-async';

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
```

### 페이지별 메타태그

```tsx
import { Head } from '@/shared/components/seo/Head';

function ProductDetail({ product }) {
  return (
    <>
      <Head
        title={product.name}
        description={product.description}
        image={product.thumbnailUrl}
        url={`https://example.com/products/${product.id}`}
      />
      <div>...</div>
    </>
  );
}

// 관리자 페이지 (인덱싱 제외)
function AdminSettings() {
  return (
    <>
      <Head title="관리자 설정" noindex />
      <div>...</div>
    </>
  );
}
```

### index.html 기본 메타태그

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="사이트 기본 설명" />

  <!-- OG 기본값 (react-helmet-async가 페이지별로 덮어씀) -->
  <meta property="og:title" content="사이트 이름" />
  <meta property="og:description" content="사이트 기본 설명" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />

  <!-- 파비콘 -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <title>사이트 이름</title>
</head>
```

---

## 2. 정적 메타태그 (빌드 타임)

크롤러가 JS를 실행하지 않는 경우를 대비해,
빌드 시 주요 페이지의 메타태그를 정적으로 생성할 수 있습니다.

### vite-plugin-html-config

```ts
// vite.config.ts
import htmlConfig from 'vite-plugin-html-config';

export default defineConfig({
  plugins: [
    react(),
    htmlConfig({
      metas: [
        { name: 'description', content: '사이트 설명' },
        { property: 'og:title', content: '사이트 이름' },
        { property: 'og:image', content: 'https://example.com/og.png' },
      ],
    }),
  ],
});
```

---

## 3. robots.txt

```
# public/robots.txt

# 일반 사이트
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml

# 관리자/사내 시스템 (크롤링 차단)
User-agent: *
Disallow: /
```

---

## 4. sitemap.xml (정적 SPA용)

SPA에서는 수동으로 sitemap을 관리하거나, 빌드 스크립트로 생성합니다.

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 5. 구조화된 데이터 (JSON-LD)

검색 결과에 리치 스니펫을 표시하려면 JSON-LD를 추가합니다.

```tsx
import { Helmet } from 'react-helmet-async';

function ProductDetail({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'KRW',
    },
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div>...</div>
    </>
  );
}
```

---

## 6. SPA SEO 한계 & SSR이 필요한 경우

| 항목 | SPA (CSR) | SSR/SSG |
|------|-----------|---------|
| 메타태그 | JS 실행 후 적용 | HTML에 포함 |
| 구글 크롤러 | JS 실행 가능 (지연 있음) | 즉시 인식 |
| 카카오/슬랙 미리보기 | JS 미실행 → 기본값만 표시 | 정상 표시 |
| 첫 로딩 속도 | 느림 (JS 다운로드 후 렌더링) | 빠름 (HTML 직접 전달) |

**카카오톡/슬랙 링크 미리보기가 중요하다면** → SPA만으로는 부족합니다.

### 대안

1. **Prerender** — 크롤러 요청만 서버에서 사전 렌더링 (`prerender.io`, `rendertron`)
2. **SSG 하이브리드** — 메인/랜딩은 Astro로, 앱은 SPA로 분리
3. **SSR 프레임워크** — Remix, Astro (React 지원)

---

## 체크리스트

새 프로젝트 SEO 세팅 시:

- [ ] `index.html`에 기본 meta description, og 태그 추가
- [ ] `react-helmet-async` HelmetProvider 감싸기
- [ ] 페이지별 `<Head>` 컴포넌트로 메타태그 설정
- [ ] `public/robots.txt` 생성
- [ ] `public/favicon.svg` (또는 .ico) 추가
- [ ] 관리자/사내 페이지에 `noindex` 설정
- [ ] (SEO 중요 시) sitemap.xml 생성
- [ ] (SEO 중요 시) JSON-LD 구조화 데이터 추가
- [ ] (카카오/슬랙 미리보기 필요 시) prerender 또는 SSR 검토
