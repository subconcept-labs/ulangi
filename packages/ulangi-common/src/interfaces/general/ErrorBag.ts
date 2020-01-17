import { ErrorCode } from '../../enums/ErrorCode';

export interface ErrorBag {
  errorCode: ErrorCode;
  error: unknown;
}
