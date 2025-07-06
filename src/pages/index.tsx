import { useState, useEffect } from 'react'
import Head from 'next/head'

interface MessageData {
  title: string
  message: string
}

export default function Home() {
  const [data, setData] = useState<MessageData>({
    title: '欢迎来到留言板',
    message: '正在加载内容...'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/message')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('获取数据失败:', error)
      setData({
        title: '加载失败',
        message: '无法获取数据，请稍后重试'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.message)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  // 防止 hydration 错误
  if (!mounted) {
    return (
      <>
        <Head>
          <title>留言板</title>
          <meta name="description" content="留言板系统" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                加载中...
              </h1>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  正在加载内容...
                </p>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.message} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.message} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.message} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {data.title}
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.message}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '刷新中...' : '刷新'}
              </button>
              
              <button
                onClick={handleCopy}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copySuccess ? '已复制!' : '复制内容'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
