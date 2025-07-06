import { NextApiRequest, NextApiResponse } from 'next';
import { getMessageBoard, updateMessageBoard } from '../../lib/db';
import { verifyToken, extractTokenFromRequest } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const messageBoard = await getMessageBoard();
      if (!messageBoard) {
        return res.status(404).json({ error: '未找到留言板数据' });
      }
      res.status(200).json(messageBoard);
    } catch (error) {
      console.error('获取留言板失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  } else if (req.method === 'POST') {
    try {
      // 验证管理员身份
      const token = extractTokenFromRequest(req);
      if (!token) {
        return res.status(401).json({ error: '未提供认证令牌' });
      }

      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ error: '无效的认证令牌' });
      }

      const { title, message } = req.body;
      if (!title || !message) {
        return res.status(400).json({ error: '标题和消息不能为空' });
      }

      const success = await updateMessageBoard(title, message);
      if (!success) {
        return res.status(500).json({ error: '更新留言板失败' });
      }

      res.status(200).json({ message: '更新成功' });
    } catch (error) {
      console.error('更新留言板失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 