import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { config } from "../../../shared/config/config";
import {
  IS3Service,
  UploadParams,
} from "../../../domain/interfaces/serviceInterface/s3/s3.service.interface";

// Initialize S3 Client
if (!config.aws.AWS_ACCESS_KEY_ID || !config.aws.AWS_SECRET_ACCESS_KEY) {
  throw new BaseError(
    "AWS credentials are not defined",
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    false
  );
}

const s3Client = new S3Client({
  region: config.aws.AWS_REGION,
  credentials: {
    accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
  },
});

const URL_EXPIRATION_SECONDS = 300; // 5 minutes

export class S3Service implements IS3Service {
  async generateUploadURL(
    params: UploadParams
  ): Promise<{ uploadURL: string; key: string }> {
    const { folder, userId, fileType } = params;
    const extension = fileType.split("/")[1];
    const key = `${folder}/${userId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: config.aws.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    try {
      const uploadURL = await getSignedUrl(s3Client, command, {
        expiresIn: URL_EXPIRATION_SECONDS,
      });
      return { uploadURL, key };
    } catch {
      throw new BaseError(
        ERROR_MSG.S3_UPLOAD_URL_GENERATION_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  async deleteObject(key: string): Promise<void> {
    if (!config.aws.S3_BUCKET_NAME) {
      throw new BaseError(
        ERROR_MSG.S3_BUCKET_NAME_UNDEFINED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: config.aws.S3_BUCKET_NAME,
      Key: key,
    });

    try {
      await s3Client.send(command);
    } catch {
      throw new BaseError(
        ERROR_MSG.S3_DELETE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }

  getImageUrl(key: string): string {
    return `https://${config.aws.S3_BUCKET_NAME}.s3.${config.aws.AWS_REGION}.amazonaws.com/${key}`;
  }
}
