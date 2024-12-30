// export interface SuccessResponse<T extends object> {
//   data: T;
//   message: string;
// }

export interface ErrorResponse {
  reason: string;
  message: string;
}
