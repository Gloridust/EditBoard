import { useState, useEffect } from 'react'
import Head from 'next/head'

interface MessageData {
  title: string
  message: string
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })
  const [messageForm, setMessageForm] = useState<MessageData>({
    title: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const [notification, setNotification] = useState('')
  const [mounted, setMounted] = useState(false)

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })

      const result = await response.json()

      if (result.success) {
        setIsLoggedIn(true)
        setToken(result.token)
        localStorage.setItem('admin_token', result.token)
        showNotification('登录成功！')
        await fetchCurrentMessage()
      } else {
        showNotification(result.message || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      showNotification('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCurrentMessage = async () => {
    try {
      const response = await fetch('/api/message')
      const result = await response.json()
      setMessageForm({
        title: result.title || '',
        message: result.message || ''
      })
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }

  const handleUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageForm,
          token
        }),
      })

      const result = await response.json()

      if (result.success) {
        showNotification('更新成功！')
      } else {
        showNotification(result.message || '更新失败')
      }
    } catch (error) {
      console.error('更新错误:', error)
      showNotification('更新失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setToken('')
    localStorage.removeItem('admin_token')
    setLoginForm({ username: '', password: '' })
    setMessageForm({ title: '', message: '' })
    showNotification('已退出登录')
  }

  useEffect(() => {
    setMounted(true)
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      setIsLoggedIn(true)
      fetchCurrentMessage()
    }
  }, [])

  // 防止 hydration 错误
  if (!mounted) {
    return (
      <>
        <Head>
          <title>管理员后台 - 留言板</title>
          <meta name="description" content="留言板管理后台" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                加载中...
              </h1>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>管理员后台 - 留言板</title>
        <meta name="description" content="留言板管理后台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {notification && (
            <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-700">
              {notification}
            </div>
          )}

          {!isLoggedIn ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                管理员登录
              </h1>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    密码
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '登录中...' : '登录'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  内容管理
                </h1>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  退出登录
                </button>
              </div>
              
              <form onSubmit={handleUpdateMessage} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={messageForm.title}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    消息内容
                  </label>
                  <textarea
                    id="message"
                    value={messageForm.message}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '更新中...' : '更新内容'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  )
} 