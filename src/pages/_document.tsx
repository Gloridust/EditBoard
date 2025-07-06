import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-CN" className="light">
      <Head />
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
