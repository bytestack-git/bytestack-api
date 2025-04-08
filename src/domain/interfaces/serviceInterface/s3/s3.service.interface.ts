export interface UploadParams {
  folder: string;
  userId: string;
  fileType: string;
}

export interface IS3Service {
  generateUploadURL(params: UploadParams): Promise<{ uploadURL: string; key: string }>;
  deleteObject(key: string): Promise<void>;
  getImageUrl(key: string): string;
}