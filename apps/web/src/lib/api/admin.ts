import { GET } from '@/lib/api';

export interface AdminStats {
  totalUsers: number;
  totalGuests: number;
  totalRooms: number;
  totalSwipes: number;
  totalMatches: number;
  activeToday: number;
  activeWeek: number;
  activeMonth: number;
}

export interface TrialStats {
  activeGhosts: number;
  totalGhosts: number;
  totalGhostsExpired: number;
  ghostSwipes: number;
  ghostMatches: number;
  engagedActiveGhosts: number;
  totalConversions: number;
  conversions30d: number;
  conversionRate30d: number;
  avgGuestSwipesAtConversion: number;
  totalGuestSwipesConverted: number;
}

export interface RetentionCohort {
  week: string;
  users: number;
  j1: number;
  j7: number;
  j30: number;
}

export interface RetentionData {
  cohorts: RetentionCohort[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
  createdAt: string;
  isGuest: boolean;
  convertedFromGuestAt: string | null;
  swipesCount: number;
  roomsCount: number;
  lastActive: string | null;
}

export type AdminUsersFilter = 'all' | 'users' | 'guests';

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  filter: AdminUsersFilter;
  totalPages: number;
}

export interface DailyActivityDay {
  date: string;
  swipes: number;
  matches: number;
  newUsers: number;
  newGuests: number;
  newConversions: number;
  newRooms: number;
}

export interface DailyActivityData {
  days: DailyActivityDay[];
}

export interface ConversionStats {
  totalUsers: number;
  onboarded: { count: number; rate: number };
  withRoom: { count: number; rate: number };
  withSwipe: { count: number; rate: number };
  totalMatches: number;
}

export interface SubscriptionStats {
  plans: Record<string, { active: number; total: number }>;
  totalPaid: number;
  totalUsers: number;
  paidRate: number;
}

export interface TopMatchMovie {
  movieId: string;
  matchCount: number;
}

export interface TopMatchesData {
  movies: TopMatchMovie[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await GET('/admin/stats');
  if (!res.ok) throw new Error(`Admin stats failed: ${res.status}`);
  return res.json();
}

export async function getAdminRetention(): Promise<RetentionData> {
  const res = await GET('/admin/retention');
  if (!res.ok) throw new Error(`Admin retention failed: ${res.status}`);
  return res.json();
}

export async function getAdminUsers(
  page = 1,
  limit = 20,
  filter: AdminUsersFilter = 'users',
): Promise<AdminUsersResponse> {
  const res = await GET(`/admin/users?page=${page}&limit=${limit}&filter=${filter}`);
  if (!res.ok) throw new Error(`Admin users failed: ${res.status}`);
  return res.json();
}

export async function getAdminTrialStats(): Promise<TrialStats> {
  const res = await GET('/admin/trial-stats');
  if (!res.ok) throw new Error(`Admin trial stats failed: ${res.status}`);
  return res.json();
}

export async function getAdminActivity(days = 30): Promise<DailyActivityData> {
  const res = await GET(`/admin/activity?days=${days}`);
  if (!res.ok) throw new Error(`Admin activity failed: ${res.status}`);
  return res.json();
}

export async function getAdminConversions(): Promise<ConversionStats> {
  const res = await GET('/admin/conversions');
  if (!res.ok) throw new Error(`Admin conversions failed: ${res.status}`);
  return res.json();
}

export async function getAdminSubscriptions(): Promise<SubscriptionStats> {
  const res = await GET('/admin/subscriptions');
  if (!res.ok) throw new Error(`Admin subscriptions failed: ${res.status}`);
  return res.json();
}

export async function getAdminTopMatches(limit = 10): Promise<TopMatchesData> {
  const res = await GET(`/admin/top-matches?limit=${limit}`);
  if (!res.ok) throw new Error(`Admin top matches failed: ${res.status}`);
  return res.json();
}

export interface HealthCheckData {
  status: string;
  timestamp: string;
  uptime: number;
  services: Record<string, string>;
}

export async function getHealthCheck(): Promise<HealthCheckData> {
  const res = await GET('/health');
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export function getExportUrl(
  type: 'users' | 'activity',
  opts?: { days?: number; filter?: AdminUsersFilter },
): string {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  if (type === 'activity') {
    return `${base}/admin/export/activity?days=${opts?.days || 30}`;
  }
  const filter = opts?.filter || 'users';
  return `${base}/admin/export/users?filter=${filter}`;
}
