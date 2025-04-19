/**
 * Utility class for handling API URLs and endpoints
 */
export class ApiUtils {
  /**
   * Get the base URL for API requests
   * @returns The base URL for API requests
   */
  public static getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  }

  /**
 * Get the full URL for a user profile endpoint
   * @param userType The type of user (teacher, shopOwner, student)
   * @returns The full URL for the user profile endpoint
   */
  public static getUserProfileUrl(userType: string): string {
    if (userType === 'shopOwner') {
        userType = 'shop_admin';
    }else if (userType === 'hostAdmin') {
        userType = 'host_admin';
    }
    return `${this.getBaseUrl()}/api/user/${userType}/getProfile`;
  }

  /**
   * Get the full URL for an authentication endpoint
   * @param endpoint The authentication endpoint (login, signup, verify-otp, etc.)
   * @param userType Optional user type for user-specific endpoints
   * @returns The full URL for the authentication endpoint
   */
  public static getAuthUrl(endpoint: string, userType?: string): string {
    if (userType) {
        if (userType === 'shopOwner') {
            userType = 'shop_admin';
        }else if (userType === 'hostAdmin') {
            userType = 'host_admin';
        }
        return `${this.getBaseUrl()}/api/auth/${userType}/${endpoint}`;
    }
    return `${this.getBaseUrl()}/api/auth/${endpoint}`;
  }

  /**
   * Get the full URL for a specific API endpoint
   * @param endpoint The API endpoint path
   * @returns The full URL for the API endpoint
   */
  public static getApiUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.getBaseUrl()}/${cleanEndpoint}`;
  }

  /**
   * Make an authenticated API request
   * @param url The full URL to make the request to
   * @param method The HTTP method (GET, POST, PUT, DELETE)
   * @param data Optional data to send with the request
   * @param userType The type of user (teacher, shopOwner, student, hostAdmin)
   * @returns The response from the API
   */
  public static async makeAuthenticatedRequest(
    url: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
    data: any = null, 
    userType: string
  ): Promise<any> {
    try {
      const token = localStorage.getItem(`${userType}_auth_token`);
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const options: RequestInit = {
        method,
        headers,
        credentials: 'include',
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
} 