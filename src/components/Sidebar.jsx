// src/components/Sidebar.jsx
import './Sidebar.css'

const Sidebar = ({ crimeData }) => {
  const {
    crimeTypes,
    selectedCrimeType,
    setSelectedCrimeType,
    allMonths,
    selectedMonths,
    setSelectedMonths,
    formatMonth,
    boroughCrimeData,
  } = crimeData

  // 处理月份范围选择
  const handleMonthRange = (e, type) => {
    const index = allMonths.indexOf(e.target.value)
    if (type === 'start') {
      const endIndex = allMonths.indexOf(selectedMonths[selectedMonths.length - 1])
      setSelectedMonths(allMonths.slice(index, endIndex + 1))
    } else {
      const startIndex = allMonths.indexOf(selectedMonths[0])
      setSelectedMonths(allMonths.slice(startIndex, index + 1))
    }
  }

  // 计算总犯罪数（所有区域加总）
  const totalCrimes = Object.values(boroughCrimeData)
    .reduce((sum, b) => sum + b.total, 0)

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Controls</h2>

      {/* ── 总犯罪数统计 ── */}
      <div className="sidebar-stat">
        <span className="stat-label">Total Crimes</span>
        <span className="stat-value">{totalCrimes.toLocaleString()}</span>
      </div>

      <div className="sidebar-stat">
        <span className="stat-label">Time Period</span>
        <span className="stat-value">
          {formatMonth(selectedMonths[0])} – {formatMonth(selectedMonths[selectedMonths.length - 1])}
        </span>
      </div>

      <div className="sidebar-divider" />

      {/* ── 犯罪类型筛选 ── */}
      <div className="sidebar-section">
        <h3 className="section-title">Crime Type</h3>
        <div className="crime-type-list">
          {crimeTypes.map(type => (
            <button
              key={type}
              className={`crime-type-btn ${selectedCrimeType === type ? 'active' : ''}`}
              onClick={() => setSelectedCrimeType(type)}
            >
              <span className="crime-type-dot" />
              {type === 'ALL' ? '🔍 All Crimes' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* ── 月份范围选择 ── */}
      <div className="sidebar-section">
        <h3 className="section-title">Time Range</h3>

        <div className="month-range">
          <label className="month-label">From</label>
          <select
            className="month-select"
            value={selectedMonths[0]}
            onChange={(e) => handleMonthRange(e, 'start')}
          >
            {allMonths.map(month => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>
        </div>

        <div className="month-range">
          <label className="month-label">To</label>
          <select
            className="month-select"
            value={selectedMonths[selectedMonths.length - 1]}
            onChange={(e) => handleMonthRange(e, 'end')}
          >
            {allMonths.map(month => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* ── 颜色图例 ── */}
      <div className="sidebar-section">
        <h3 className="section-title">Map Legend</h3>
        <div className="legend">
          <div className="legend-bar" />
          <div className="legend-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
