-- 留言板系统数据库初始化脚本
-- 在 Supabase SQL Editor 中运行此脚本

-- 创建留言板表
CREATE TABLE IF NOT EXISTS message_board (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认数据（可选）
INSERT INTO message_board (title, message) 
VALUES (
  '欢迎来到留言板', 
  '这是一个简单的留言板系统。管理员可以在后台修改这里显示的内容。'
) 
ON CONFLICT DO NOTHING;

-- 创建更新时间自动更新的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_message_board_updated_at 
    BEFORE UPDATE ON message_board 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 设置行级安全策略（RLS）
ALTER TABLE message_board ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取数据
CREATE POLICY "Allow anonymous read access" ON message_board
    FOR SELECT USING (true);

-- 允许匿名用户插入和更新数据（在实际应用中，你可能想要更严格的策略）
CREATE POLICY "Allow anonymous insert access" ON message_board
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON message_board
    FOR UPDATE USING (true);

-- 查看表结构
\d message_board; 