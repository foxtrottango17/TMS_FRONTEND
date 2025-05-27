declare module '@/lib/auth' {
  export function getToken(): string | null;
  export function setToken(token: string): void;
  export function removeToken(): void;
}
