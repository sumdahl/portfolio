'use client';

import { Mail, MapPin } from 'lucide-react';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Send, Check } from 'lucide-react';
import { notify } from '@/lib/utils/notifications';

import { contactSchema, type ContactFormValues } from '@/lib/validations/contact';

export default function ContactPage() {
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      notify.fromResponse(result, {
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.'
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Network error:", error);
      setStatus('error');
      notify.error("Something went wrong. Please check your connection.");
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact Methods & Info */}
          <div className="space-y-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Direct channels to reach me
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:sumirandahal46@gmail.com" className="text-muted-foreground hover:text-primary transition-colors block">
                      sumirandahal46@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">Kathmandu, Nepal</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h3 className="font-semibold mb-3">Social Media</h3>
                  <SocialLinks />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  I typically respond to messages within 24 hours. For urgent matters, please use email.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: The Contact Form */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and I&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className="bg-secondary/50 border-border/50 focus:border-primary transition-all duration-300 h-12 rounded-xl"
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
                          className="bg-secondary/50 border-border/50 focus:border-primary transition-all duration-300 h-12 rounded-xl"
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
                          className="resize-none bg-secondary/50 border-border/50 focus:border-primary transition-all duration-300 min-h-[150px] rounded-xl p-4"
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
          </div>
        </div>
      </div>
    </div>
  );
}
