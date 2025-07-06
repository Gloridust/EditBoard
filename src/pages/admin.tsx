import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface MessageBoard {
  id: number;
  title: string;
  message: string;
  updated_at: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  // 编辑表单状态
  const [editForm, setEditForm] = useState({
    title: '',
    message: ''
  });
  
  // 检查是否已经登录
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      loadCurrentMessage();
    }
  }, []);

  // 加载当前留言板内容
  const loadCurrentMessage = async () => {
    try {
      const response = await fetch('/api/message');
      if (response.ok) {
        const data: MessageBoard = await response.json();
        setEditForm({
          title: data.title,
          message: data.message
        });
      }
    } catch (error) {
      console.error('加载留言板内容失败:', error);
    }
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('adminToken', data.token);
        await loadCurrentMessage();
      } else {
        const error = await response.json();
        alert(error.error || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理更新留言板
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      
      if (response.ok) {
        alert('更新成功！');
      } else {
        const error = await response.json();
        alert(error.error || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理登出
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('adminToken');
    setLoginForm({ username: '', password: '' });
    setEditForm({ title: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>管理员后台 - 留言板</title>
        <meta name="description" content="留言板管理员后台" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {!isLoggedIn ? (
            // 登录表单
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">管理员登录</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '登录中...' : '登录'}
                </button>
              </form>
            </div>
          ) : (
            // 编辑表单
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">编辑留言板</h1>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  登出
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">消息内容</label>
                  <textarea
                    value={editForm.message}
                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? '更新中...' : '更新留言板'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 