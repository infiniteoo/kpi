'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { separateByUser } from '../utils/dataManipulation'
import DataDisplay from '../components/DataDIsplay'
import Loading from '../components/Loading'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userObject, setUserObject] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let result = await axios.get('http://localhost:5000/api/excel')
        setLoading(false)
        setData(result.data)
        let compiledUserObject = separateByUser(result.data)
        console.log('user object', compiledUserObject)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading ? <Loading /> : <DataDisplay />}
    </main>
  )
}
