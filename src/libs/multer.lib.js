import multer from "multer";
import fs from "fs";

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const path = `uploads/`;
            fs.mkdirSync(path, { recursive: true });
            cb(null, path);
        },
        filename: (req, file, cb) => {
            cb(null, `${crypto.randomUUID()}.${file.mimetype.split("/")[1]}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

        if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
            return cb(new Error("Invalid image type"));
        }

        cb(null, true);
    },
}).single("postImage");

export const uploadFile = (req, res, next) => {
    upload(req, res, (e) => {
        if (e instanceof multer.MulterError) {
            return res.status(400).json({ message: e.message });
        } else if (e) {
            return res.status(400).json({ message: e.message });
        }

        next();
    });
};
