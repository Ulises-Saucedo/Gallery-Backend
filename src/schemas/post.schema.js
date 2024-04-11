import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const PostSchema = z.object({
    postImage: z
        .any()
        .refine((file) => file, "Image is obligatory")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
            "Format not supported."
        ),
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
        .trim()
        .min(6, {
            message: "Title must be 5 or more characters long ",
        })
        .max(20, {
            message: "Title must be 20 or fewer characters long",
        }),
});

export const PostUpdateSchema = z.object({
    postImage: z
        .any()
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
            "Format not supported."
        )
        .optional(),
    title: z
        .string({
            invalid_type_error: "Title must be a string",
        })
        .trim()
        .min(6, {
            message: "Title must be 5 or more characters long ",
        })
        .max(20, {
            message: "Title must be 20 or fewer characters long",
        })
        .optional(),
});
