export interface UploadParams {
  folder: string;
  userId: string;
  fileType: string;
}

export interface IFileUploadService {
  generateUploadURL(params: UploadParams): Promise<{ uploadURL: string; key: string }>;
  deleteObject(key: string): Promise<void>;
  getImageUrl(key: string): string;
}