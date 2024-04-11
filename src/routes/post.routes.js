import { Router } from "express";
import {
    getImages,
    getImage,
    getPostImages,
    postImage,
    updatePost,
    deletePost,
} from "../controllers/post.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { uploadFile } from "../libs/multer.lib.js";
import { PostSchema, PostUpdateSchema } from "../schemas/post.schema.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";

const router = Router();

router.get("/public", getImages);
router.get("/public/:id", getImage);
router.get("/images/post", validateToken, getPostImages);
router.post(
    "/images/post",
    validateToken,
    uploadFile,
    validateSchema(PostSchema),
    postImage
);
router.patch(
    "/images/post/:id",
    validateToken,
    uploadFile,
    validateSchema(PostUpdateSchema),
    updatePost
);
router.delete("/images/post/:id", validateToken, deletePost);

export default router;
