export interface DataResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  status?: number;
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
