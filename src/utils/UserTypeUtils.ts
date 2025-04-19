import { Route } from "@/routers/types";

export type UserType = 'teacher' | 'shopOwner' | 'student' | 'hostAdmin';

// Define a type for the router that matches Next.js AppRouter
export interface AppRouter {
  push: (href: any, options?: any) => void;
}

export class UserTypeUtils {
  private static readonly TEACHER_ADMIN_PATH = '/teacher-admin';
  private static readonly SHOP_OWNER_ADMIN_PATH = '/shop-owner-admin';
  private static readonly HOST_ADMIN_PATH = '/host-admin';
  private static readonly STUDENT_PATH = '';

  public static getUserTypeFromPathname(pathname: string | null | undefined): UserType {
    if (!pathname) {
      return 'student';
    }

    if (pathname.startsWith(this.TEACHER_ADMIN_PATH)) {
      return 'teacher';
    }

    if (pathname.startsWith(this.SHOP_OWNER_ADMIN_PATH)) {
      return 'shopOwner';
    }

    if (pathname.startsWith(this.HOST_ADMIN_PATH)) {
      return 'hostAdmin';
    }

    return 'student';
  }

  /**
   * Gets the homepage URL for the specified user type
   * @param userType The type of user
   * @returns The homepage URL for the user type
   */
  public static getHomepageUrl(userType: UserType): Route<string> {
    switch (userType) {
      case 'teacher':
        return this.TEACHER_ADMIN_PATH as Route<string>;
      case 'shopOwner':
        return this.SHOP_OWNER_ADMIN_PATH as Route<string>;
      case 'hostAdmin':
        return this.HOST_ADMIN_PATH as Route<string>;
      case 'student':
      default:
        return this.STUDENT_PATH as Route<string>;
    }
  }

  /**
   * Removes the auth token for the specified user type
   * @param userType The type of user
   */
  public static removeAuthToken(userType: UserType): void {
    localStorage.removeItem(`${userType}_auth_token`);
  }

  /**
   * Gets the redirect path after logout for the specified user type
   * @param userType The type of user
   * @returns The path to redirect to after logout
   */
  public static getLogoutRedirectPath(userType: UserType): string {
    switch (userType) {
      case 'teacher':
        return this.TEACHER_ADMIN_PATH;
      case 'shopOwner':
        return this.SHOP_OWNER_ADMIN_PATH;
      case 'hostAdmin':
        return this.HOST_ADMIN_PATH;
      case 'student':
      default:
        return this.STUDENT_PATH;
    }
  }

  /**
   * Handles the complete logout process for a user
   * @param userType The type of user
   * @param router The Next.js router instance
   */
  public static handleLogout(userType: UserType, router: AppRouter): void {
    this.removeAuthToken(userType);
    router.push(this.getLogoutRedirectPath(userType));
    window.location.reload();
  }

  /**
   * Checks if the given user type matches the current path
   * @param userType The type of user to check
   * @param pathname The current pathname
   * @returns boolean indicating if the user type matches the path
   */
  public static isUserTypeForPath(userType: UserType, pathname: string | null | undefined): boolean {
    const pathUserType = this.getUserTypeFromPathname(pathname);
    return userType === pathUserType;
  }
} 