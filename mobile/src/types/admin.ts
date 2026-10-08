export interface AdminUser {
  id: number;
  nome: string;
  email: string;
}

export interface AdminAuthResponse {
  token: string;
  admin: AdminUser;
}
