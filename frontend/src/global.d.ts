export {};

declare global {
  interface BackendResponse<T> {
    data?: T;
    error?: Array<{ message: string; location: string }>;
    message: string;
    success: boolean;
  }
}
