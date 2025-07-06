import { sql } from '@vercel/postgres';

export interface MessageBoard {
  id: number;
  title: string;
  message: string;
  updated_at: Date;
}

// 数据库连接重试配置
const DB_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1秒
};

// 带重试的数据库查询函数
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  retries = DB_RETRY_CONFIG.maxRetries
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${operationName} 失败 (剩余重试次数: ${retries}):`, error);
    
    if (retries > 0) {
      console.log(`等待 ${DB_RETRY_CONFIG.retryDelay}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, DB_RETRY_CONFIG.retryDelay));
      return executeWithRetry(operation, operationName, retries - 1);
    }
    
    throw error;
  }
}

// 检查数据库表是否存在
async function checkTableExists(): Promise<boolean> {
  try {
    const result = await executeWithRetry(
      () => sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'message_board'
        );
      `,
      '检查表是否存在'
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error('检查表是否存在失败:', error);
    // 如果检查失败，假设表不存在，让后续创建表的操作来处理
    return false;
  }
}

// 自动初始化数据库
async function autoInitDB(): Promise<void> {
  try {
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.log('数据库表不存在，开始自动初始化...');
      
      // 创建留言板表
      await executeWithRetry(
        () => sql`
          CREATE TABLE IF NOT EXISTS message_board (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL DEFAULT '欢迎来到留言板',
            message TEXT NOT NULL DEFAULT '这是一个简单的留言板系统',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `,
        '创建数据库表'
      );
      
      // 检查是否已有数据
      const countResult = await executeWithRetry(
        () => sql`SELECT COUNT(*) FROM message_board`,
        '检查数据数量'
      );
      
      const count = countResult.rows[0].count;
      
      if (count === '0') {
        // 插入默认数据
        await executeWithRetry(
          () => sql`
            INSERT INTO message_board (title, message) 
            VALUES ('欢迎来到留言板', '这是一个简单的留言板系统')
          `,
          '插入默认数据'
        );
      }
      
      console.log('数据库自动初始化完成');
    }
  } catch (error) {
    console.error('数据库自动初始化失败:', error);
    // 不抛出错误，让应用继续运行
    // 这样即使初始化失败，应用仍然可以尝试其他操作
  }
}

export async function initDB() {
  try {
    // 创建留言板表
    await executeWithRetry(
      () => sql`
        CREATE TABLE IF NOT EXISTS message_board (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL DEFAULT '欢迎来到留言板',
          message TEXT NOT NULL DEFAULT '这是一个简单的留言板系统',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      '手动创建数据库表'
    );

    // 检查是否已有数据，如果没有则插入默认数据
    const result = await executeWithRetry(
      () => sql`SELECT COUNT(*) FROM message_board`,
      '检查数据数量'
    );
    const count = result.rows[0].count;
    
    if (count === '0') {
      await executeWithRetry(
        () => sql`
          INSERT INTO message_board (title, message) 
          VALUES ('欢迎来到留言板', '这是一个简单的留言板系统')
        `,
        '插入默认数据'
      );
    }
    
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

export async function getMessageBoard(): Promise<MessageBoard | null> {
  try {
    // 尝试自动初始化数据库
    await autoInitDB();
    
    const result = await executeWithRetry(
      () => sql`SELECT * FROM message_board ORDER BY id DESC LIMIT 1`,
      '获取留言板数据'
    );
    
    return result.rows[0] as MessageBoard || null;
  } catch (error) {
    console.error('获取留言板数据失败:', error);
    return null;
  }
}

export async function updateMessageBoard(title: string, message: string): Promise<boolean> {
  try {
    // 尝试自动初始化数据库
    await autoInitDB();
    
    // 检查是否有数据，如果没有则先插入
    const checkResult = await executeWithRetry(
      () => sql`SELECT COUNT(*) FROM message_board`,
      '检查数据数量'
    );
    const count = checkResult.rows[0].count;
    
    if (count === '0') {
      await executeWithRetry(
        () => sql`
          INSERT INTO message_board (title, message) 
          VALUES (${title}, ${message})
        `,
        '插入新数据'
      );
    } else {
      await executeWithRetry(
        () => sql`
          UPDATE message_board 
          SET title = ${title}, message = ${message}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = (SELECT id FROM message_board ORDER BY id DESC LIMIT 1)
        `,
        '更新数据'
      );
    }
    
    return true;
  } catch (error) {
    console.error('更新留言板数据失败:', error);
    return false;
  }
} 