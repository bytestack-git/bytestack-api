import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  IFileUploadService,
  UploadParams,
} from "../../../domain/interfaces/serviceInterface/file-upload/file-upload.service.interface";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";
@injectable()
export class FileUploadController implements IController {
  constructor(
    @inject("IFileUploadService") private fileUploadService: IFileUploadService
  ) {}

  async handle(
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
