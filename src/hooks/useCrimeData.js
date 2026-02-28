// src/hooks/useCrimeData.js
import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'

export const useCrimeData = () => {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCrimeType, setSelectedCrimeType] = useState('ALL')
  const [selectedBorough, setSelectedBorough] = useState(null)
  const [selectedMonths, setSelectedMonths] = useState([])

  useEffect(() => {
    Papa.parse('/data/mps_borough_crime_24m.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const filtered = results.data.filter(row => row.BoroughName)
        const boroughNames = [...new Set(filtered.map(row => row.BoroughName))]
        console.log('CSV Borough Names:', boroughNames)
        setRawData(filtered)
        setLoading(false)
      },
      error: (err) => {
        setError(err)
        setLoading(false)
      }
    })
  }, [])

  const allMonths = useMemo(() => {
    if (rawData.length === 0) return []
    return Object.keys(rawData[0]).filter(key => /^\d{6}$/.test(key)).sort()
  }, [rawData])

  useEffect(() => {
    if (allMonths.length > 0 && selectedMonths.length === 0) {
      setSelectedMonths(allMonths)
    }
  }, [allMonths])

  const crimeTypes = useMemo(() => {
    const types = [...new Set(rawData.map(row => row.MajorText))]
    return ['ALL', ...types.filter(Boolean).sort()]
  }, [rawData])

  const boroughs = useMemo(() => {
    return [...new Set(rawData.map(row => row.BoroughName))].filter(Boolean).sort()
  }, [rawData])

  const boroughCrimeData = useMemo(() => {
    if (rawData.length === 0 || selectedMonths.length === 0) return {}

    const filtered = selectedCrimeType === 'ALL'
      ? rawData
      : rawData.filter(row => row.MajorText === selectedCrimeType)

    const result = {}

    filtered.forEach(row => {
      const borough = row.BoroughName
      if (!borough) return

      if (!result[borough]) {
        result[borough] = {
          name: borough,
          total: 0,
          byType: {},
          byMonth: {}
        }
      }

      selectedMonths.forEach(month => {
        const count = parseInt(row[month]) || 0
        result[borough].total += count

        if (!result[borough].byMonth[month]) {
          result[borough].byMonth[month] = 0
        }
        result[borough].byMonth[month] += count

        const type = row.MajorText
        if (!result[borough].byType[type]) {
          result[borough].byType[type] = 0
        }
        result[borough].byType[type] += count
      })
    })

    return result
  }, [rawData, selectedCrimeType, selectedMonths])

  const { maxCount, minCount } = useMemo(() => {
    const values = Object.values(boroughCrimeData).map(d => d.total)
    return {
      maxCount: Math.max(...values, 1),
      minCount: Math.min(...values, 0)
    }
  }, [boroughCrimeData])

  const selectedBoroughData = useMemo(() => {
    if (!selectedBorough) return null
    return boroughCrimeData[selectedBorough] || null
  }, [selectedBorough, boroughCrimeData])

  const formatMonth = (monthStr) => {
    if (!monthStr) return ''
    const year = monthStr.slice(0, 4)
    const month = monthStr.slice(4, 6)
    const date = new Date(`${year}-${month}-01`)
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  }

  return {
    loading,
    error,
    rawData,
    allMonths,
    crimeTypes,
    boroughs,
    boroughCrimeData,
    selectedBoroughData,
    maxCount,
    minCount,
    selectedCrimeType,
    setSelectedCrimeType,
    selectedBorough,
    setSelectedBorough,
    selectedMonths,
    setSelectedMonths,
    formatMonth
  }
}