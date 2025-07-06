import { sql } from '@vercel/postgres';

export interface MessageBoard {
  id: number;
  title: string;
  message: string;
  updated_at: Date;
}

export async function initDB() {
  try {
    // 创建留言板表
    await sql`
      CREATE TABLE IF NOT EXISTS message_board (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT '欢迎来到留言板',
        message TEXT NOT NULL DEFAULT '这是一个简单的留言板系统',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 检查是否已有数据，如果没有则插入默认数据
    const result = await sql`SELECT COUNT(*) FROM message_board`;
    const count = result.rows[0].count;
    
    if (count === '0') {
      await sql`
        INSERT INTO message_board (title, message) 
        VALUES ('欢迎来到留言板', '这是一个简单的留言板系统')
      `;
    }
    
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

export async function getMessageBoard(): Promise<MessageBoard | null> {
  try {
    const result = await sql`SELECT * FROM message_board ORDER BY id DESC LIMIT 1`;
    return result.rows[0] as MessageBoard || null;
  } catch (error) {
    console.error('获取留言板数据失败:', error);
    return null;
  }
}

export async function updateMessageBoard(title: string, message: string): Promise<boolean> {
  try {
    await sql`
      UPDATE message_board 
      SET title = ${title}, message = ${message}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = (SELECT id FROM message_board ORDER BY id DESC LIMIT 1)
    `;
    return true;
  } catch (error) {
    console.error('更新留言板数据失败:', error);
    return false;
  }
} 