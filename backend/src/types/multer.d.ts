declare module "multer" {
  import type { Request, RequestHandler } from "express";

  namespace multer {
    interface File {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    }
  }

  interface MulterOptions {
    storage?: unknown;
    limits?: { fileSize?: number };
    fileFilter?: (req: Request, file: multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void;
  }

  interface MulterInstance {
    single(fieldName: string): RequestHandler;
  }

  interface MulterFactory {
    (options?: MulterOptions): MulterInstance;
    memoryStorage(): unknown;
  }

  const multer: MulterFactory;
  export default multer;
}

declare namespace Express {
  interface Request {
    file?: import("multer").File;
  }
}
