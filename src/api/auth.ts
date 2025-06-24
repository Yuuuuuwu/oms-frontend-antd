import { axiosWithAuth } from "../utils/axiosWithAuth";
import { BACKEND_URL } from "../utils/env";

export async function forgotPassword(email: string): Promise<string | null> {
  try {
    const res = await axiosWithAuth.post(`${BACKEND_URL}/auth/forgot-password`, { email });
    return res.data.reset_token;
  } catch {
    return null;
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    await axiosWithAuth.post(`${BACKEND_URL}/auth/reset-password`, { token, new_password: newPassword });
    return true;
  } catch {
    return false;
  }
}
