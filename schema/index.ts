import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string()
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(4, {
        message: "Password at least 4 characters"
    }),
    name:  z.string().min(2, {
        message: "Name is Required"
    })
})