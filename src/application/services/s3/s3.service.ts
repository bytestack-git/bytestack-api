import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { config } from "../../../shared/config/config";
import {
  IS3Service,
  UploadParams,
} from "../../../domain/interfaces/serviceInterface/s3/s3.service.interface";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
  region: config.aws.AWS_REGION,
});

const s3 = new AWS.S3();
const URL_EXPIRATION_SECONDS = 300; // 5 minutes

export class S3Service implements IS3Service {
  async generateUploadURL(
    params: UploadParams
  ): Promise<{ uploadURL: string; key: string }> {
    const { folder, userId, fileType } = params;
    const extension = fileType.split("/")[1];
    const key = `${folder}/${userId}/${uuidv4()}.${extension}`; // e.g., "profile-images/user123/abc123.jpg"

    const s3Params = {
      Bucket: config.aws.S3_BUCKET_NAME,
      Key: key,
      Expires: URL_EXPIRATION_SECONDS,
      ContentType: fileType,
      ACL: "public-read", // Make the image publicly readable
    };

    try {
      const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
      return { uploadURL, key };
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw new BaseError(
        ERROR_MSG.S3_UPLOAD_URL_GENERATION_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }

  async deleteObject(key: string): Promise<void> {
    if (!config.aws.S3_BUCKET_NAME) {
      throw new BaseError(
        ERROR_MSG.S3_BUCKET_NAME_UNDEFINED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const params = {
      Bucket: config.aws.S3_BUCKET_NAME,
      Key: key,
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error("Error deleting object from S3:", error);
      throw new BaseError(
        ERROR_MSG.S3_DELETE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }

  getImageUrl(key: string): string {
    return `https://${config.aws.S3_BUCKET_NAME}.s3.${config.aws.AWS_REGION}.amazonaws.com/${key}`;
  }
}
