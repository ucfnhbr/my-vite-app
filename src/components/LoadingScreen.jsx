// src/components/LoadingScreen.jsx
import { useEffect, useState } from 'react'
import './LoadingScreen.css'

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onFinish(), 400)
          return 100
        }
        return prev + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      cursor: 'none',
    }}>
      {/* 红色圆点鼠标 */}
      <div style={{
        position: 'fixed',
        left: cursor.x,
        top: cursor.y,
        width: 14,
        height: 14,
        backgroundColor: '#e63946',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 999999,
        boxShadow: '0 0 12px rgba(230,57,70,0.5)',
      }} />

      {/* 中间内容 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        width: 480,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          color: '#e63946',
          letterSpacing: '-0.02em',
          fontFamily: 'Segoe UI, sans-serif',
        }}>
          London Crime Explorer
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#888888' }}>
          Loading crime data across 33 boroughs...
        </p>

        {/* 进度条 */}
        <div style={{
          width: '100%',
          height: 2,
          backgroundColor: '#eeeeee',
          borderRadius: 999,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#e63946',
            borderRadius: 999,
            transition: 'width 0.1s ease',
          }} />
        </div>

        <p style={{ fontSize: '0.85rem', color: '#e63946', fontWeight: 600 }}>
          {progress}%
        </p>
      </div>
    </div>
  )
}

export default LoadingScreen

