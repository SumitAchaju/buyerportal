export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ message: string; location: string }>;
}
