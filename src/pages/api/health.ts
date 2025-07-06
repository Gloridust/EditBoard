import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // 检查数据库连接
    await sql`SELECT 1 as test`;
    
    // 检查表是否存在
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'message_board'
      );
    `;
    
    const tableExists = tableCheck.rows[0].exists;
    
    // 如果表存在，检查数据
    let dataCount = 0;
    if (tableExists) {
      const countResult = await sql`SELECT COUNT(*) FROM message_board`;
      dataCount = parseInt(countResult.rows[0].count);
    }
    
    res.status(200).json({
      status: 'healthy',
      database: {
        connected: true,
        tableExists,
        dataCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('健康检查失败:', error);
    res.status(500).json({
      status: 'unhealthy',
      database: {
        connected: false,
        error: error instanceof Error ? error.message : '未知错误'
      },
      timestamp: new Date().toISOString()
    });
  }
} 