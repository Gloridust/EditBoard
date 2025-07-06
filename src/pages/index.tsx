import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface MessageBoard {
  id: number;
  title: string;
  message: string;
  updated_at: string;
}

export default function Home() {
  const [messageBoard, setMessageBoard] = useState<MessageBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 加载留言板内容
  const loadMessageBoard = async () => {
    try {
      const response = await fetch('/api/message');
      if (response.ok) {
        const data: MessageBoard = await response.json();
        setMessageBoard(data);
      } else {
        console.error('加载留言板失败');
      }
    } catch (error) {
      console.error('加载留言板失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    loadMessageBoard();
  }, []);

  // 刷新按钮处理
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMessageBoard();
  };

  // 复制按钮处理
  const handleCopy = async () => {
    if (!messageBoard) return;
    
    try {
      const textToCopy = `${messageBoard.title}\n\n${messageBoard.message}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      // 降级处理：使用传统的复制方法
      const textArea = document.createElement('textarea');
      textArea.value = `${messageBoard.title}\n\n${messageBoard.message}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{messageBoard?.title || '留言板'}</title>
        <meta name="description" content={messageBoard?.message || '留言板系统'} />
        <meta property="og:title" content={messageBoard?.title || '留言板'} />
        <meta property="og:description" content={messageBoard?.message || '留言板系统'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={messageBoard?.title || '留言板'} />
        <meta name="twitter:description" content={messageBoard?.message || '留言板系统'} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">加载中...</p>
            </div>
          ) : messageBoard ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {messageBoard.title}
                  </h1>
                  <div className="border-t border-b border-gray-200 py-6">
                    <div className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed">
                      {messageBoard.message}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <svg 
                      className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {refreshing ? '刷新中...' : '刷新'}
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copySuccess ? '已复制！' : '复制'}
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  最后更新：{new Date(messageBoard.updated_at).toLocaleString('zh-CN')}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">暂无留言板内容</p>
              <button
                onClick={handleRefresh}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                重新加载
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
