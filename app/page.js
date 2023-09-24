'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let result = await axios.get('http://localhost:5000/api/excel')
        setLoading(false)
        setData(result.data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading ? <h1>Loading...</h1> : <h1>Loaded</h1>}
    </main>
  )
}
