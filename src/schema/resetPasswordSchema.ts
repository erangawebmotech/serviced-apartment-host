import { z } from 'zod';

// Schema for requesting a password reset email
export const getResetRequestSchema = () => {
  return z.object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email address.' })
      .min(1, { message: 'Email is required.' }),
  });

};

// Schema for setting a new password
export const getNewPasswordSchema = () => {
  return z
    .object({
      newPassword: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters.' })
        .max(50, { message: 'Password must not exceed 50 characters.' })
        .regex(/[A-Z]/, {
          message: 'Password must contain at least one uppercase letter.',
        })
        .regex(/[0-9]/, {
          message: 'Password must contain at least one number.',
        }),
      confirmPassword: z
        .string()
        .min(1, { message: 'Please confirm your password.' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
};

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});


export type ResetRequestSchemaType = z.infer<ReturnType<typeof getResetRequestSchema>>;

export type NewPasswordSchemaType = z.infer<ReturnType<typeof getNewPasswordSchema>>;

export type OtpSchemaType = z.infer<typeof otpSchema>;