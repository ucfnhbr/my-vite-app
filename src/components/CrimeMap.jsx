// src/components/CrimeMap.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import HoverChart from './HoverChart'
import ClickChart from './ClickChart'
import './CrimeMap.css'

const CrimeMap = ({ crimeData }) => {
  const {
    boroughCrimeData,
    maxCount,
    minCount,
    selectedBorough,
    setSelectedBorough,
    selectedMonths,
    formatMonth,
  } = crimeData

  const mapContainer = useRef(null)
  const map = useRef(null)
  const boroughCrimeDataRef = useRef(boroughCrimeData)
  const selectedBoroughRef = useRef(selectedBorough)
  const [hoveredBorough, setHoveredBorough] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [clickedBorough, setClickedBorough] = useState(null)

  useEffect(() => {
    boroughCrimeDataRef.current = boroughCrimeData
  }, [boroughCrimeData])

  useEffect(() => {
    selectedBoroughRef.current = selectedBorough
  }, [selectedBorough])

  const getColorExpression = useCallback(() => {
    if (Object.keys(boroughCrimeData).length === 0) return 'rgba(204,204,204,0.7)'

    const stops = []
    Object.entries(boroughCrimeData).forEach(([name, data]) => {
      const ratio = maxCount > minCount
        ? (data.total - minCount) / (maxCount - minCount)
        : 0
      const r = 255
      const g = Math.round(245 - ratio * 200)
      const b = Math.round(245 - ratio * 245)
      stops.push([name, `rgba(${r},${g},${b},0.7)`])  // ← 加上 0.7
    })

    return [
      'match',
      ['get', 'ctyua15nm'],
      ...stops.flat(),
      'rgba(255,255,255,0.5)'
    ]
  }, [boroughCrimeData, maxCount, minCount])

  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
          }
        ]
      },
      center: [-0.1278, 51.5074],
      zoom: 9,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      map.current.addSource('boroughs', {
        type: 'geojson',
        data: `${import.meta.env.BASE_URL}data/uk_boroughs.geojson`
      })

      // 填充图层
      map.current.addLayer({
        id: 'boroughs-fill',
        type: 'fill',
        source: 'boroughs',
        paint: {
          'fill-color': 'rgba(255,255,255,0.5)',
          'fill-opacity': 1
        }
      })

      // 普通边界图层（细，深色）
      map.current.addLayer({
        id: 'boroughs-outline',
        type: 'line',
        source: 'boroughs',
        paint: {
          'line-color': '#333333',
          'line-width': 0.8
        }
      })

      // 高亮边界图层（在最上面，不会被遮盖）
      map.current.addLayer({
        id: 'boroughs-highlight',
        type: 'line',
        source: 'boroughs',
        paint: {
          'line-color': 'rgba(0,0,0,0)',
          'line-width': 4
        }
      })

      // 鼠标悬停事件
      map.current.on('mousemove', 'boroughs-fill', (e) => {
        if (e.features.length > 0) {
          map.current.getCanvas().style.cursor = 'pointer'
          const name = e.features[0].properties.ctyua15nm
          const data = boroughCrimeDataRef.current[name]
          const isLondon = data !== undefined

          setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY })

          if (!isLondon) {
            setHoveredBorough({ name, noData: true })
          } else {
            setHoveredBorough({ name, data })
          }

          // 高亮悬停和选中区域
          map.current.setPaintProperty('boroughs-highlight', 'line-color', [
            'match',
            ['get', 'ctyua15nm'],
            name, '#e63946',
            selectedBoroughRef.current || '', '#e63946',
            'rgba(0,0,0,0)'
          ])
        }
      })

      // 鼠标离开事件
      map.current.on('mouseleave', 'boroughs-fill', () => {
        map.current.getCanvas().style.cursor = ''
        setHoveredBorough(null)

        // 只保留选中区域高亮
        map.current.setPaintProperty('boroughs-highlight', 'line-color', [
          'match',
          ['get', 'ctyua15nm'],
          selectedBoroughRef.current || '', '#e63946',
          'rgba(0,0,0,0)'
        ])
      })

      // 点击事件
      map.current.on('click', 'boroughs-fill', (e) => {
        const name = e.features[0].properties.ctyua15nm
        const data = boroughCrimeDataRef.current[name]
        setSelectedBorough(prev => prev === name ? null : name)
        if (data) setClickedBorough({ name, data })
      })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // 更新颜色
  useEffect(() => {
    if (!map.current) return

    const updateColors = () => {
      if (!map.current.getLayer('boroughs-fill')) return
      map.current.setPaintProperty(
        'boroughs-fill',
        'fill-color',
        getColorExpression()
      )
    }

    if (map.current.isStyleLoaded()) {
      updateColors()
    } else {
      map.current.on('load', updateColors)
    }
  }, [boroughCrimeData, getColorExpression])

  // 更新选中区域高亮
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return
    if (!map.current.getLayer('boroughs-highlight')) return

    map.current.setPaintProperty('boroughs-highlight', 'line-color', [
      'match',
      ['get', 'ctyua15nm'],
      selectedBorough || '', '#e63946',
      'rgba(0,0,0,0)'
    ])
  }, [selectedBorough])

  return (
    <div className="crime-map-container">
      <div ref={mapContainer} className="maplibre-map" />

      {/* 悬浮折线图 */}
      {hoveredBorough && !clickedBorough && (
        hoveredBorough.noData
          ? (
            <div style={{
              position: 'fixed',
              left: mousePos.x + 16,
              top: mousePos.y - 40,
              backgroundColor: '#ffffff',
              border: '1px solid #eeeeee',
              borderRadius: 8,
              padding: '10px 14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111111' }}>
                {hoveredBorough.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#888888', marginTop: 2 }}>
                No crime data available
              </p>
            </div>
          )
          : selectedMonths.length >= 2 && (
            <HoverChart
              name={hoveredBorough.name}
              byMonth={hoveredBorough.data.byMonth}
              formatMonth={formatMonth}
              position={mousePos}
            />
          )
      )}

      {/* 点击放大图表 */}
      {clickedBorough && (
        <ClickChart
          name={clickedBorough.name}
          byMonth={clickedBorough.data.byMonth}
          formatMonth={formatMonth}
          onClose={() => {
            setClickedBorough(null)
            setSelectedBorough(null)
          }}
        />
      )}
    </div>
  )
}

export default CrimeMap
