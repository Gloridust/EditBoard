import { NextApiRequest, NextApiResponse } from 'next';
import { initDB } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await initDB();
    res.status(200).json({ message: '数据库初始化成功' });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    res.status(500).json({ error: '数据库初始化失败' });
  }
} 