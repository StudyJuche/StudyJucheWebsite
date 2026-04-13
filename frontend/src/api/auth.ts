export interface UserRead {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'student';
  is_verified: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

const API_BASE_URL = '/'; // Use relative path, Caddy will proxy to backend

export const loginUser = async (username: string, password: string): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await fetch(`${API_BASE_URL}token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to login');
  }
  return res.json();
};

export const registerUser = async (userData: UserCreate): Promise<UserRead> => {
  const res = await fetch(`${API_BASE_URL}register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to register');
  }
  return res.json();
};

export const fetchCurrentUser = async (token: string): Promise<UserRead> => {
  const res = await fetch(`${API_BASE_URL}users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch current user');
  }
  return res.json();
};

export const changePassword = async (token: string, currentPassword: string, newPassword: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}api/users/me/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to change password');
  }
  // No content on success (204 No Content)
};

export const deleteUserAccount = async (token: string, username: string, password: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}api/users/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to delete account');
  }
  // No content on success (204 No Content)
};
