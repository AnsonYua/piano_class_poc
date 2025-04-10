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
} 