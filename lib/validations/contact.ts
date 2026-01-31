import * as z from 'zod';

export const contactSchema = z.object({
  name: z.string().min(7, 'Name must be at least 7 characters').max(50, 'Name is too long'),
  email: z.email('Please enter a valid email address'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000, 'Message is too long'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
