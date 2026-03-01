// src/App.jsx
import { useState } from 'react'
import { useCrimeData } from './hooks/useCrimeData'
import CrimeMap from './components/CrimeMap'
import Sidebar from './components/Sidebar'
import IntroModal from './components/IntroModal'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

export default function App() {
  const [showLoading, setShowLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const crimeData = useCrimeData()
  const { loading, error } = crimeData

  if (loading || showLoading) {
    return <LoadingScreen onFinish={() => setShowLoading(false)} />
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>❌ Error loading data: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="app">
      {showIntro && <IntroModal onStart={() => setShowIntro(false)} />}

      {/* Data Notes 弹窗 */}
      {showNotes && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setShowNotes(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '32px 36px',
              maxWidth: 560,
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              borderBottom: '1px solid #eeeeee',
              paddingBottom: 12,
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111111' }}>
                Data and Methodology Description
              </h2>
              <button
                onClick={() => setShowNotes(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: '#888888',
                }}
              >✕</button>
            </div>

            {/* 内容 */}
            {[
              {
                title: 'Data Sources.',
                content: 'This tool draws on borough-level monthly crime data published by the Metropolitan Police Service (MPS), covering February 2024 to January 2026. Borough boundaries are sourced from the UK Office for National Statistics (ONS) GeoJSON dataset.'
              },
              {
                title: 'Methodological Approach.',
                content: 'Crime counts are aggregated by borough and crime category across the selected time range. The choropleth map uses a linear colour scale normalised between the minimum and maximum borough totals within the current filter selection.'
              },
              {
                title: 'Interpretative Scope.',
                content: 'The visualisation foregrounds spatial and temporal variation in recorded crime. Comparisons across boroughs reflect absolute counts rather than population-adjusted rates, which may reflect differences in borough population size.'
              },
              {
                title: 'Limitations.',
                content: 'The analysis operates at borough scale and therefore obscures intra-borough variability. It does not incorporate socioeconomic, housing, or demographic indicators. Crime figures represent recorded offences only and may be subject to reporting biases.'
              },
            ].map(({ title, content }) => (
              <div key={title} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.85rem', color: '#111111', lineHeight: 1.6 }}>
                  <strong>{title}</strong> {content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <header className="app-header">
        <h1>🔍 London Crime Explorer</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: '0.8rem', color: '#888888' }}>
            Explore crime statistics across London boroughs (Feb 2024 – Jan 2026)
          </p>
          <button
            onClick={() => setShowNotes(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              color: '#e63946',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Data and Methodology Description
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <Sidebar crimeData={crimeData} />
        </aside>

        <section className="app-map">
          <CrimeMap crimeData={crimeData} />
        </section>
      </main>
    </div>
  )
}
