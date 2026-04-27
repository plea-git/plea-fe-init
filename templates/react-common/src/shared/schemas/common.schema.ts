import { z } from 'zod';

/** 필수 문자열 */
export const requiredString = (message = '필수 입력 항목입니다.') => z.string().min(1, message);

/** 이메일 */
export const emailSchema = z.string().trim().email('올바른 메일 주소를 입력해 주세요.');

/** 비밀번호 (영문 + 숫자 + 특수문자 조합, 8-20자) */
export const passwordSchema = z
  .string()
  .min(8, '최소 8자 이상 입력해주세요')
  .max(20, '20자 이하로 입력해주세요')
  .regex(/[A-Za-z]/, '영문,숫자,특수문자 모두 조합하여 8-20자로 입력해 주세요.')
  .regex(/\d/, '영문,숫자,특수문자 모두 조합하여 8-20자로 입력해 주세요.')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, '영문,숫자,특수문자 모두 조합하여 8-20자로 입력해 주세요.');

/** 전화번호 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^01[016789]\d{7,8}$/, '올바른 전화번호를 입력해주세요.');

/** 사업자등록번호 */
export const businessNumberSchema = z
  .string()
  .regex(/^\d{3}-\d{2}-\d{5}$/, '올바른 사업자등록번호를 입력해주세요.');

/** 비밀번호 확인 refine 헬퍼 */
export const passwordConfirmRefine = <T extends { password: string; confirmPassword: string }>(
  data: T,
) => data.password === data.confirmPassword;

export const passwordConfirmRefineMessage = {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'] as const,
};
