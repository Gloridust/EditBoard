import { NextApiRequest, NextApiResponse } from 'next'

// 默认数据
const defaultData = {
  title: '欢迎来到留言板',
  message: '这是一个简单的留言板系统。管理员可以在后台修改这里显示的内容。\n\n要使用完整功能，请配置 Supabase 环境变量：\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY'
}

// 检查是否配置了 Supabase
function hasSupabaseConfig(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// 获取 Supabase 客户端
async function getSupabaseClient() {
  if (!hasSupabaseConfig()) {
    return null
  }
  
  try {
    // 使用动态导入避免在没有配置时的错误
    const supabaseModule = await import('../../lib/supabase')
    return supabaseModule.supabase
  } catch (error) {
    console.error('无法导入 Supabase 客户端:', error)
    return null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // 如果没有配置 Supabase，返回默认数据
    if (!hasSupabaseConfig()) {
      return res.status(200).json(defaultData)
    }

    const supabase = await getSupabaseClient()
    if (!supabase) {
      return res.status(200).json(defaultData)
    }

    // 获取当前留言板内容
    try {
      const { data, error } = await supabase
        .from('message_board')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase 查询错误:', error)
        return res.status(200).json(defaultData)
      }

      // 如果没有数据，返回默认值
      if (!data) {
        return res.status(200).json(defaultData)
      }

      res.status(200).json({
        title: data.title,
        message: data.message
      })
    } catch (error) {
      console.error('获取留言板数据错误:', error)
      // 发生错误时返回默认数据而不是报错
      res.status(200).json(defaultData)
    }
  } else if (req.method === 'POST') {
    // 如果没有配置 Supabase，返回错误
    if (!hasSupabaseConfig()) {
      return res.status(500).json({ 
        message: '系统未配置数据库，请联系管理员配置 Supabase 环境变量' 
      })
    }

    const supabase = await getSupabaseClient()
    if (!supabase) {
      return res.status(500).json({ 
        message: '数据库连接失败，请检查配置' 
      })
    }

    // 更新留言板内容（需要管理员权限）
    const { title, message, token } = req.body

    if (!token) {
      return res.status(401).json({ message: '需要管理员权限' })
    }

    if (!title || !message) {
      return res.status(400).json({ message: '标题和消息不能为空' })
    }

    try {
      // 简单的令牌验证（实际项目中应该使用更安全的方式）
      const decoded = Buffer.from(token, 'base64').toString()
      if (!decoded.startsWith('admin:')) {
        return res.status(401).json({ message: '无效的令牌' })
      }

      // 尝试更新现有记录
      const { data: existingData } = await supabase
        .from('message_board')
        .select('id')
        .single()

      if (existingData) {
        // 更新现有记录
        const { error } = await supabase
          .from('message_board')
          .update({
            title,
            message,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)

        if (error) throw error
      } else {
        // 创建新记录
        const { error } = await supabase
          .from('message_board')
          .insert({
            title,
            message,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }

      res.status(200).json({ 
        message: '更新成功',
        success: true
      })
    } catch (error) {
      console.error('更新留言板数据错误:', error)
      res.status(500).json({ message: '服务器错误' })
    }
  } else {
    res.status(405).json({ message: '不支持的请求方法' })
  }
}