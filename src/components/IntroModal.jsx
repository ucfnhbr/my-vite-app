// src/components/IntroModal.jsx
import './IntroModal.css'

const IntroModal = ({ onStart }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h1 className="modal-title">Crime Across London</h1>

        <p className="modal-subtitle">
          London's crime varies dramatically by borough, type, and time.
          This tool lets you explore those patterns interactively.
        </p>

        <ul className="modal-list">
          <li><strong>Map:</strong> see crime intensity across all London boroughs.</li>
          <li><strong>Filter:</strong> switch crime types to reveal shifting patterns.</li>
          <li><strong>Time Range:</strong> track changes over 24 months.</li>
          <li><strong>Click a borough:</strong> reveal its detailed breakdown.</li>
        </ul>

        <p className="modal-footer">
          <strong>Changing the filter changes who appears most at risk.</strong>
        </p>

        <button className="modal-btn" onClick={onStart}>
          Start Exploring →
        </button>
      </div>
    </div>
  )
}

export default IntroModal
