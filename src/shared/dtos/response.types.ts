export interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ResponseDto {
  success: boolean;
  message: string;
  status: number;
}
