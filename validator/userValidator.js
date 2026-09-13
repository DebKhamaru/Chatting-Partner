import z from "zod";

export const signinSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name must not exceed 30 characters"),
    age: z
        .number()
        .min(5, "Age must be at least 5")
        .max(120, "Age must be at least 120")
        .optional(),
    email: z.preprocess((value)=>
            typeof value == "string" ? value.trim().toLowerCase(): "",
            z.email("Email must be valid")
        ),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(30, "Password must not exceed 30 characters")
        .regex(/[A-Z]/, "Password should contain at least 1 Capital Letter")
        .regex(/[a-z]/, "Password should contain at least 1 Capital Letter")
        .regex(/[0-9]/, "Password should contain at least 1 Capital Letter")
        .regex(/[~`!@#$%^&*?/><:;'"_+=]/, "Password should contain at least 1 Special Character")
});

export const loginSchema = z.object({
    email: z.preprocess((value)=>
            typeof value == "string" ? value.trim().toLowerCase(): "",
            z.email("Email must be valid")
    ),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(30, "Password must not exceed 30 characters")
        .regex(/[A-Z]/, "Password should contain at least 1 Capital Letter")
        .regex(/[a-z]/, "Password should contain at least 1 Capital Letter")
        .regex(/[0-9]/, "Password should contain at least 1 Capital Letter")
        .regex(/[~`!@#$%^&*?><:;'"_+=]/, "Password should contain at least 1 Special Character")
})