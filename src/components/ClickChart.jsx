// src/components/ClickChart.jsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts'

const ClickChart = ({ name, byMonth, formatMonth, onClose }) => {
  if (!byMonth) return null

  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: formatMonth(month),
      crimes: count
    }))

  const maxCrimes = Math.max(...data.map(d => d.crimes))
  const total = data.reduce((sum, d) => sum + d.crimes, 0)
  const avg = Math.round(total / data.length)

  // 高亮前3名
  const top3 = [...data]
    .sort((a, b) => b.crimes - a.crimes)
    .slice(0, 3)
    .map(d => d.month)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          padding: '32px 36px',
          width: 640,
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}>
          <div>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#111111',
            }}>
              {name}
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: '#888888',
              marginTop: 4,
            }}>
              Monthly crime breakdown · {data.length} months
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#888888',
            }}
          >
            ✕
          </button>
        </div>

        {/* 统计数字 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
          marginBottom: 24,
        }}>
          {[
            { label: 'Total Crimes', value: total.toLocaleString() },
            { label: 'Monthly Average', value: avg.toLocaleString() },
            { label: 'Peak Month', value: data.find(d => d.crimes === maxCrimes)?.month },
          ].map(({ label, value }) => (
            <div key={label} style={{
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
              padding: '12px 16px',
            }}>
              <p style={{
                fontSize: '0.72rem',
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {label}
              </p>
              <p style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#e63946',
                marginTop: 4,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* 柱状图 */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={14}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#888888' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#888888' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                fontSize: '0.75rem',
                border: 'none',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [value.toLocaleString(), 'Crimes']}
            />
            <ReferenceLine
              y={avg}
              stroke="#888888"
              strokeDasharray="4 4"
              label={{ value: 'avg', fontSize: 10, fill: '#888888' }}
            />
            <Bar dataKey="crimes" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={top3.includes(entry.month) ? '#e63946' : '#ffb3b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <p style={{
          fontSize: '0.75rem',
          color: '#888888',
          marginTop: 12,
        }}>
          🔴 Highlighted bars = top 3 highest crime months
        </p>
      </div>
    </div>
  )
}

export default ClickChart

