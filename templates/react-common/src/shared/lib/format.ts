import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * 포맷팅 유틸리티
 *
 * 날짜, 숫자, 전화번호, 사업자번호 등 공통 포맷팅 함수
 */

// ─── 날짜 ──────────────────────────────────────────────

type DateInput = string | number | Date | null | undefined;

const SERVER_DATE_FORMATS = [
  'YYYY.MM.DD HH:mm:ss',
  'YYYY.MM.DD HH:mm',
  'YYYY.MM.DD',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD',
];

function parseDate(value: DateInput): dayjs.Dayjs | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date || typeof value === 'number') return dayjs(value);

  const parsed = dayjs(value);
  if (parsed.isValid()) return parsed;

  const withFormat = dayjs(value, SERVER_DATE_FORMATS, true);
  return withFormat.isValid() ? withFormat : null;
}

/**
 * 날짜 포맷팅
 * @example
 * formatDate('2024-01-15') // '2024.01.15'
 * formatDate('2024-01-15T10:30:00', 'YYYY.MM.DD HH:mm') // '2024.01.15 10:30'
 */
export function formatDate(value: DateInput, format = 'YYYY.MM.DD', fallback = '-'): string {
  const parsed = parseDate(value);
  return parsed ? parsed.format(format) : fallback;
}

/**
 * 날짜 범위 정규화 (시작일이 항상 종료일 이전이 되도록)
 * @example
 * normalizeRange(new Date('2024-03-15'), new Date('2024-03-01'))
 * // { from: 2024-03-01, to: 2024-03-15 }
 */
export function normalizeRange(a: Date, b: Date): { from: Date; to: Date } {
  return a <= b ? { from: a, to: b } : { from: b, to: a };
}

// ─── 숫자 ──────────────────────────────────────────────

/**
 * 숫자 3자리마다 콤마
 * @example
 * insertComma(1234567) // '1,234,567'
 * insertComma('1234567') // '1,234,567'
 */
export function insertComma(value: number | string): string {
  if (value === 0 || value === '0') return '0';
  if (!value) return '';

  const number = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(number)) return '';

  return number.toLocaleString('ko-KR');
}

// ─── 전화번호 ────────────────────────────────────────────

/**
 * 전화번호 포맷팅
 * @example
 * formatPhoneNumber('01012345678') // '010-1234-5678'
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
}

/**
 * 사업자등록번호 포맷팅
 * @example
 * formatBizNumber('1234567890') // '123-45-67890'
 */
export function formatBizNumber(bizNum: string): string {
  if (!bizNum) return '';
  return bizNum.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
}

// ─── 마스킹 ──────────────────────────────────────────────

/**
 * 이름 마스킹
 * - 한글: 첫글자, 마지막 글자 제외 마스킹 (홍*동)
 * - 영문: 처음 2자 제외 마스킹 (Jo***)
 * @example
 * maskName('홍길동') // '홍*동'
 * maskName('John') // 'Jo**'
 */
export function maskName(name: string): string {
  if (!name) return '';
  if (name.length <= 1) return name;

  const isKorean = /[가-힣]/.test(name);

  if (isKorean) {
    if (name.length === 2) return `${name[0]}*`;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
  }

  return `${name.slice(0, 2)}${'*'.repeat(name.length - 2)}`;
}

/**
 * 이메일 마스킹 (계정 처음 2자 제외, 도메인 노출)
 * @example
 * maskEmail('hong@example.com') // 'ho**@example.com'
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [account, domain] = email.split('@');
  if (!account || !domain) return email;
  if (account.length <= 2) return `${account}@${domain}`;
  return `${account.slice(0, 2)}${'*'.repeat(account.length - 2)}@${domain}`;
}

/**
 * 전화번호 마스킹 (가운데 4자리)
 * @example
 * maskPhone('010-1234-5678') // '010-****-5678'
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\d{3})-?(\d{4})-?(\d{4})/, '$1-****-$3');
}

/**
 * 아이디 마스킹 (처음 2자 제외)
 * @example
 * maskId('username') // 'us******'
 */
export function maskId(id: string): string {
  if (!id) return '';
  if (id.length <= 2) return id;
  return `${id.slice(0, 2)}${'*'.repeat(id.length - 2)}`;
}
