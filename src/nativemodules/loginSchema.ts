import {z} from 'zod';

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: `Email is required.`,
      invalid_type_error: 'Invalid Email.',
    })
    .email(),
  password: z
    .string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must have atleast 8 characters.',
    })
    .min(8),
});

export type TLoginUserSchema = z.infer<typeof loginUserSchema>;
