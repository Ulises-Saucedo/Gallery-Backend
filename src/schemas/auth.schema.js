import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string",
        })
        .trim()
        .min(6, {
            message: "Username must be 5 or more characters long ",
        })
        .max(20, {
            message: "Username must be 20 or fewer characters long",
        }),
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Invalid email",
        }),
    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
        .trim()
        .min(6, {
            message: "Password must be at least 6 characters",
        })
        .max(20, {
            message: "Password must be 20 or fewer characters long",
        }),
});

export const loginSchema = z.object({
    username: z
        .string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string",
        })
        .trim()
        .min(6, {
            message: "Username must be 5 or more characters long ",
        })
        .max(20, {
            message: "Username must be 20 or fewer characters long",
        }),
    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
        .trim()
        .min(6, {
            message: "Password must be at least 6 characters",
        })
        .max(20, {
            message: "Password must be 20 or fewer characters long",
        }),
});
