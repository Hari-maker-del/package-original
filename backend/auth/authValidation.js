const { z } = require("zod");

const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must not exceed 120 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  accountType: z.literal("User").default("User"),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
};