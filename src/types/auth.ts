export interface AuthUser {
    id: string;
    email: string;
    fullName?: string;
    avatar?: string;
    role: {
      id: string;
      name: string;
    };
  }
  