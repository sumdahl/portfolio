import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class ApiClient {
  private async request<T>(endpoint: string, method: RequestMethod, data?: unknown, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        url: endpoint,
        method,
        data,
        ...options,
        headers: {
          ...options.headers,
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Try to obtain error message from response data
        const errorMessage = error.response?.data?.error || 
                             error.response?.data?.message || 
                             error.message || 
                             'An unexpected error occurred';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  get<T>(endpoint: string, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  post<T>(endpoint: string, data?: unknown, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  put<T>(endpoint: string, data?: unknown, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  delete<T>(endpoint: string, options?: AxiosRequestConfig) {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

export const apiClient = new ApiClient();
