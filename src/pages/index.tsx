import { useState, useEffect } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

interface MessageData {
  title: string
  message: string
}

interface HomeProps {
  initialData: MessageData
}

export default function Home({ initialData }: HomeProps) {
  const [data, setData] = useState<MessageData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
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
    // 组件挂载后再次获取最新数据
    fetchData()
  }, [])

  // 防止 hydration 错误
  if (!mounted) {
    return (
      <>
        <Head>
          <title>{data.title}</title>
          <meta name="description" content={data.message} />
          
          {/* Open Graph 标签 */}
          <meta property="og:title" content={data.title} />
          <meta property="og:description" content={data.message} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://edit-board.vercel.app/api/icon" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta property="og:image:type" content="image/png" />
          
          {/* Twitter Card 标签 */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={data.title} />
          <meta name="twitter:description" content={data.message} />
          <meta name="twitter:image" content="https://edit-board.vercel.app/api/icon" />
          
          {/* 微信专用标签 */}
          <meta property="og:image:secure_url" content="https://edit-board.vercel.app/api/icon" />
          <meta name="image" content="https://edit-board.vercel.app/api/icon" />
          
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
        </Head>
        <main className="min-h-screen bg-gray-50 py-12 px-4 text-gray-900" style={{ colorScheme: 'light' }}>
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
        
        {/* Open Graph 标签 */}
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.message} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://edit-board.vercel.app/api/icon" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Twitter Card 标签 */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.message} />
        <meta name="twitter:image" content="https://edit-board.vercel.app/api/icon" />
        
        {/* 微信专用标签 */}
        <meta property="og:image:secure_url" content="https://edit-board.vercel.app/api/icon" />
        <meta name="image" content="https://edit-board.vercel.app/api/icon" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4 text-gray-900" style={{ colorScheme: 'light' }}>
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

// 服务器端渲染，确保微信爬虫能获取到正确的 meta 信息
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const defaultData: MessageData = {
    title: '欢迎来到留言板',
    message: '这是一个简单的留言板系统。管理员可以在后台修改这里显示的内容。'
  }

  try {
    // 检查是否配置了 Supabase
    const hasSupabaseConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    if (!hasSupabaseConfig) {
      return {
        props: {
          initialData: {
            title: '欢迎来到留言板',
            message: '这是一个简单的留言板系统。管理员可以在后台修改这里显示的内容。\n\n要使用完整功能，请配置 Supabase 环境变量：\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY'
          }
        }
      }
    }

    // 尝试获取数据库中的数据
    const supabaseModule = await import('../lib/supabase')
    const { supabase } = supabaseModule

    const { data, error } = await supabase
      .from('message_board')
      .select('*')
      .single()

    if (error || !data) {
      // 如果没有数据或出错，返回默认数据
      return {
        props: {
          initialData: defaultData
        }
      }
    }

    return {
      props: {
        initialData: {
          title: data.title,
          message: data.message
        }
      }
    }
  } catch (error) {
    console.error('服务器端获取数据失败:', error)
    // 出错时返回默认数据
    return {
      props: {
        initialData: defaultData
      }
    }
  }
}
