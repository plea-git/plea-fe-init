import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  /** og:image URL */
  image?: string;
  /** canonical URL (중복 페이지 방지) */
  url?: string;
  /** 검색엔진 인덱싱 여부 (기본 true) */
  noindex?: boolean;
}

const SITE_NAME = 'React Common';
const DEFAULT_DESCRIPTION = 'dev3-thor 프론트엔드 팀 공통 React 베이스 프로젝트';

/**
 * 페이지별 SEO 메타태그 컴포넌트
 *
 * @example
 * // 기본 사용
 * <Head title="사용자 목록" description="사용자를 조회하고 관리합니다" />
 *
 * // OG 이미지 포함
 * <Head
 *   title="대시보드"
 *   description="실시간 통계 대시보드"
 *   image="https://example.com/og-dashboard.png"
 *   url="https://example.com/dashboard"
 * />
 *
 * // 검색엔진 인덱싱 제외 (관리자 페이지 등)
 * <Head title="관리자 설정" noindex />
 */
export function Head({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  noindex = false,
}: HeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph (카카오톡, 슬랙, 페이스북 등 링크 미리보기) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical URL (중복 페이지 방지) */}
      {url && <link rel="canonical" href={url} />}

      {/* 검색엔진 인덱싱 제어 */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
