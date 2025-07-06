import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

export interface AuthPayload {
  username: string;
  iat?: number;
  exp?: number;
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    // 简单的用户名密码验证
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } catch (error) {
    console.error('管理员验证失败:', error);
    return false;
  }
}

export function generateToken(username: string): string {
  try {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  } catch (error) {
    console.error('Token生成失败:', error);
    throw error;
  }
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error('Token验证失败:', error);
    return null;
  }
}

export function extractTokenFromRequest(req: { headers: { authorization?: string } }): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
} 