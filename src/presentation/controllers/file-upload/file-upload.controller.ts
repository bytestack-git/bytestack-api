import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IFileUploadController } from "../../../domain/interfaces/controllerInterface/file-upload/file-upload.controller.interface";
import {
  IFileUploadService,
  UploadParams,
} from "../../../domain/interfaces/serviceInterface/file-upload/file-upload.service.interface";
@injectable()
export class FileUploadController implements IFileUploadController {
  constructor(
    @inject("IFileUploadService") private fileUploadService: IFileUploadService
  ) {}

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
      const { uploadURL, key } =
        await this.fileUploadService.generateUploadURL(params);

      res.status(200).json({ uploadURL, key });
    } catch (error) {
      next(error);
    }
  }
}
