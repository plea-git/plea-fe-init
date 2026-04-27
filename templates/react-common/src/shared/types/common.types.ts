import type { z } from 'zod';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Zod inference helper
export type InferSchema<T extends z.ZodType> = z.infer<T>;
