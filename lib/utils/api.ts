type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions extends RequestInit {
  data?: any;
}

class ApiClient {
  private async request<T>(endpoint: string, method: RequestMethod, options: ApiRequestOptions = {}): Promise<T> {
    const { data, headers, ...customConfig } = options;
    
    const config: RequestInit = {
      method,
      headers: {
        ...(data && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...customConfig,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, config);

    if (!response.ok) {
      // Try to parse error message from JSON, fallback to status text
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Ignore JSON parse error for error responses
      }
      throw new Error(errorMessage);
    }

    // Return null for 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    // For other success codes, try parsing JSON
    try {
      return await response.json();
    } catch {
      return null as T;
    }
  }

  get<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, 'GET', options);
  }

  post<T>(endpoint: string, data?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, 'POST', { ...options, data });
  }

  put<T>(endpoint: string, data?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, 'PUT', { ...options, data });
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

export const apiClient = new ApiClient();
