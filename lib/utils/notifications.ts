import { toast } from 'sonner';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

type DefaultMessages = {
  success?: string;
  error?: string;
};

export const notify = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  fromResponse: (response: ApiResponse, defaultMessages?: DefaultMessages) => {
    if (response.success) {
      const message = response.message || defaultMessages?.success || 'Operation successful';
      toast.success(message);
    } else {
      const message = response.error || response.message || defaultMessages?.error || 'Operation failed';
      toast.error(message);
    }
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  }
};
