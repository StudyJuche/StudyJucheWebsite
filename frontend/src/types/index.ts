// frontend/src/types/index.ts

export interface User {
  id: number;
  username: string;
  email: string;
  is_verified: boolean;
  role: 'admin' | 'moderator' | 'student';
}
