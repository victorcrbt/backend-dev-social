import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const avatarUploadConfig = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'avatars'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

const imageUploadConfig = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'images'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

export { avatarUploadConfig, imageUploadConfig };
