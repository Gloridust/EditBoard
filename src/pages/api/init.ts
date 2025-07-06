import { NextApiRequest, NextApiResponse } from 'next';
import { initDB } from '../../lib/db';

// 注意：数据库现在会在首次访问时自动初始化
// 此端点保留用于手动初始化或故障排除
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await initDB();
    res.status(200).json({ message: '数据库手动初始化成功' });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    res.status(500).json({ error: '数据库初始化失败' });
  }
} 