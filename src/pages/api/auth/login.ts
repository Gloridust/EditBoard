import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { config } from '../../../config/env'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允许 POST 请求' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }

  try {
    // 验证用户名
    if (username !== config.admin.username) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, await bcrypt.hash(config.admin.password, 10))
    if (!isValidPassword && password !== config.admin.password) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    // 登录成功，返回简单的令牌（实际项目中应该使用 JWT）
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
    
    res.status(200).json({ 
      message: '登录成功',
      token,
      success: true
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
} 