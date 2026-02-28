// src/components/HoverChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const HoverChart = ({ name, byMonth, formatMonth, position }) => {
  if (!byMonth) return null

  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: formatMonth(month),
      crimes: count
    }))

  if (data.length < 2) return null

  const total = data.reduce((sum, d) => sum + d.crimes, 0)

  // 计算卡片位置，避免超出屏幕
  const cardWidth = 320
  const cardHeight = 120
  const x = position.x + cardWidth > window.innerWidth
    ? position.x - cardWidth - 8
    : position.x + 16
  const y = position.y + cardHeight > window.innerHeight
    ? position.y - cardHeight - 8
    : position.y - 60

  return (
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      backgroundColor: '#ffffff',
      border: '1px solid #eeeeee',
      borderRadius: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      zIndex: 9999,
      width: cardWidth,
      pointerEvents: 'none',
      display: 'flex',
      overflow: 'hidden',
    }}>

      {/* 左侧：总犯罪数 */}
      <div style={{
        width: '35%',
        backgroundColor: '#fff5f5',
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        borderRight: '1px solid #eeeeee',
      }}>
        <p style={{
          fontSize: '0.7rem',
          color: '#888888',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 4,
        }}>
          {name}
        </p>
        <p style={{
          fontSize: '1.3rem',
          fontWeight: 800,
          color: '#e63946',
          lineHeight: 1.1,
        }}>
          {total.toLocaleString()}
        </p>
        <p style={{
          fontSize: '0.68rem',
          color: '#888888',
        }}>
          total crimes
        </p>
      </div>

      {/* 右侧：折线图 */}
      <div style={{
        flex: 1,
        padding: '10px 10px 6px 4px',
      }}>
        <p style={{
          fontSize: '0.68rem',
          color: '#888888',
          marginBottom: 4,
          paddingLeft: 8,
        }}>
          Crime trend
        </p>
        <ResponsiveContainer width="100%" height={72}>
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 8, fill: '#aaaaaa' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontSize: '0.7rem',
                border: 'none',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [value.toLocaleString(), 'Crimes']}
            />
            <Line
              type="monotone"
              dataKey="crimes"
              stroke="#e63946"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#e63946' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HoverChart


