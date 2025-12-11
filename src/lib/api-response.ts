/**
 * Chuẩn hóa format lỗi API
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

/**
 * Chuẩn hóa format response thành công
 */
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Các mã lỗi chuẩn
 */
export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',

  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  BAD_REQUEST: 'BAD_REQUEST',

  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

/**
 * Tạo error response chuẩn
 */
export function createErrorResponse(
  message: string,
  code?: string,
  errors?: Record<string, string[]>
): ApiError {
  return {
    success: false,
    message,
    code,
    errors,
  };
}

/**
 * Tạo success response chuẩn
 */
export function createSuccessResponse<T>(data: T, message?: string): ApiSuccess<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Map HTTP status code từ error code
 */
export function getStatusCodeFromErrorCode(code: string): number {
  switch (code) {
    case ErrorCodes.UNAUTHORIZED:
    case ErrorCodes.TOKEN_EXPIRED:
    case ErrorCodes.TOKEN_INVALID:
    case ErrorCodes.ACCOUNT_LOCKED:
    case ErrorCodes.ACCOUNT_INACTIVE:
      return 401;

    case ErrorCodes.FORBIDDEN:
    case ErrorCodes.INSUFFICIENT_PERMISSIONS:
      return 403;

    case ErrorCodes.NOT_FOUND:
      return 404;

    case ErrorCodes.VALIDATION_ERROR:
    case ErrorCodes.INVALID_INPUT:
    case ErrorCodes.ALREADY_EXISTS:
      return 400;

    case ErrorCodes.INTERNAL_ERROR:
    case ErrorCodes.DATABASE_ERROR:
      return 500;

    default:
      return 500;
  }
}
