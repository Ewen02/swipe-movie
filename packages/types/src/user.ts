// User data shape
export interface UserData {
  id: string;
  email: string;
  name?: string | null;
  emailVerified: boolean;
  image?: string | null;
  roles: string[];
  stripeCustomerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Session data shape
export interface SessionData {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Account data shape (OAuth providers)
export interface AccountData {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
