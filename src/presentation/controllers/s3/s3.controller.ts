import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IS3Controller } from "../../../domain/interfaces/controllerInterface/s3/s3.controller.interface";
import {
  IS3Service,
  UploadParams,
} from "../../../domain/interfaces/serviceInterface/s3/s3.service.interface";
@injectable()
export class S3Controller implements IS3Controller {
  constructor(@inject("IS3Service") private s3Service: IS3Service) {}

  async getUploadURL(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { folder, fileType } = req.body;
      if (!folder || !fileType) {
        res.status(400).json({ message: "Missing folder or fileType" });
        return;
      }

      const params: UploadParams = { folder, userId, fileType };
      const { uploadURL, key } = await this.s3Service.generateUploadURL(params);

      console.log("+++++++++++",uploadURL, key);
      res.status(200).json({ uploadURL, key });
    } catch (error) {
      next(error);
    }
  }
}
