import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    organizationName: z.string().min(2, "Organization name is required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional().nullable(),
  quantity: z.coerce.number().int("Quantity must be a whole number").min(0, "Quantity cannot be negative"),
  costPrice: z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().min(0).nullable()),
  sellingPrice: z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().min(0).nullable()),
  lowStockThreshold: z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().int().min(0).nullable()),
});