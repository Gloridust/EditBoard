import { sql } from '@vercel/postgres';

async function testDatabaseConnection() {
  console.log('🔍 开始测试数据库连接...');
  
  try {
    // 测试基本连接
    console.log('1. 测试基本连接...');
    await sql`SELECT 1 as test`;
    console.log('✅ 数据库连接成功');
    
    // 检查表是否存在
    console.log('2. 检查表是否存在...');
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'message_board'
      );
    `;
    const tableExists = tableCheck.rows[0].exists;
    console.log(`${tableExists ? '✅' : '❌'} 表存在: ${tableExists}`);
    
    if (tableExists) {
      // 检查数据
      console.log('3. 检查数据...');
      const countResult = await sql`SELECT COUNT(*) FROM message_board`;
      const count = countResult.rows[0].count;
      console.log(`✅ 数据记录数: ${count}`);
      
      if (count > 0) {
        const dataResult = await sql`SELECT * FROM message_board ORDER BY id DESC LIMIT 1`;
        const data = dataResult.rows[0];
        console.log('📄 最新数据:', {
          id: data.id,
          title: data.title,
          message: data.message.substring(0, 50) + '...',
          updated_at: data.updated_at
        });
      }
    } else {
      console.log('⚠️  表不存在，将在首次访问时自动创建');
    }
    
    console.log('🎉 数据库测试完成！');
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    console.error('💡 请检查环境变量配置：');
    console.error('   - POSTGRES_URL');
    console.error('   - POSTGRES_PRISMA_URL');
    console.error('   - POSTGRES_URL_NON_POOLING');
    console.error('   - POSTGRES_USER');
    console.error('   - POSTGRES_HOST');
    console.error('   - POSTGRES_PASSWORD');
    console.error('   - POSTGRES_DATABASE');
    process.exit(1);
  }
}

testDatabaseConnection(); 