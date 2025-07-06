import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // 获取当前留言板内容
    try {
      const { data, error } = await supabase
        .from('message_board')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // 如果没有数据，返回默认值
      if (!data) {
        return res.status(200).json({
          title: '欢迎来到留言板',
          message: '这里是默认消息内容'
        })
      }

      res.status(200).json({
        title: data.title,
        message: data.message
      })
    } catch (error) {
      console.error('获取留言板数据错误:', error)
      res.status(500).json({ message: '服务器错误' })
    }
  } else if (req.method === 'POST') {
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