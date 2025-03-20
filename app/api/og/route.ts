// app/api/og/route.ts
import { ImageResponse } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || 'NaijaSpark Quiz'
    const tagline =
      searchParams.get('tagline') ||
      'Discover the vibrant culture of Nigeria through fun, interactive quizzes'

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#F8F9FA',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 'bold', color: '#333' }}>
            {title}
          </div>
          <div style={{ fontSize: 24, color: '#555', marginTop: '1rem', textAlign: 'center' }}>
            {tagline}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error(e.message)
    return new Response(`Failed to generate the image`, { status: 500 })
  }
}
