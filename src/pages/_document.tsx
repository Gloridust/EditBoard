import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-CN" className="light">
      <Head>
        {/* 基础图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* 预览图标相关 */}
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta name="twitter:image" content="/favicon.ico" />
        
        {/* 微信分享图标 */}
        <meta name="image" content="/favicon.ico" />
        <meta property="og:image:secure_url" content="/favicon.ico" />
      </Head>
      <body className="bg-gray-50 text-gray-900">
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 强制使用浅色模式
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
              // 防止系统暗色模式影响
              if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.style.colorScheme = 'light';
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}
