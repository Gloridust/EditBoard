import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      >
        留言板
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
} 