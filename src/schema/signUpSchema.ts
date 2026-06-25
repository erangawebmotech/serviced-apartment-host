import { z } from 'zod';

export const getSignUpSchema = () => {
  return z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100)
      .regex(
        /^[a-zA-Z][a-zA-Z\s]*$/,
        'First name should only contain letters and spaces',
      ),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100)
      .regex(
        /^[a-zA-Z][a-zA-Z\s]*$/,
        'Last name should only contain letters and spaces',
      ),
    email: z.string().email('Invalid email address').max(100),
    countryCode: z.string(),
    phoneNumber: z.string().min(1, 'Contact number is required').max(15),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 5 characters.' })
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
    otp: z
      .string()
      .length(6, 'OTP must be 6 digits')
      .optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
}

export type SignUpSchemaType = z.infer<ReturnType<typeof getSignUpSchema>>;
