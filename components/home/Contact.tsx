'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Send,
  Check,
  Github,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/utils/api';

import { contactSchema, type ContactFormValues } from '@/lib/validations/contact';

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sumiran-dahal-108285220/',
    icon: Linkedin,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/sumdahl',
    icon: Github,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/sumiran_dahal',
    icon: Twitter,
  },
  {
    name: 'Email',
    url: 'mailto:sumirandahal46@gmail.com',
    icon: Mail,
  },
];

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading');

    try {
      await apiClient.post('/api/contact', data);

      setStatus('success');
      toast.success("Message sent successfully!");
      form.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="contact">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <span className="text-accent font-medium tracking-wider text-sm uppercase mb-3 block">Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Get in Touch
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 font-light">
              Have a project in mind, a question, or just want to say hello?
              I&apos;m always open to discussing new opportunities and creative ideas.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      title={link.name}
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form Side with Shadcn Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          {...field}
                          className="bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all duration-300 h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          className="bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all duration-300 h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project..."
                          className="resize-none bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all duration-300 min-h-[150px] rounded-xl p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === 'loading'}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-xl py-6 text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">Sending...</span>
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Sent</span>
                    ) : (
                      <span className="flex items-center gap-2">Send Message <Send className="w-4 h-4 ml-1" /></span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
