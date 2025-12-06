import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

// __dirname 기반으로 절대 경로 생성 (dist로 빌드해도 경로가 올바름)
const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default {
  storage: diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      callback(null, uuid() + ext);
    },
  }),
};