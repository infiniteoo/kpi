'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { separateByUser } from '../utils/dataManipulation'
import Header from '../components/Header'
import DataDisplay from '../components/Data.jsx'

import ParticleDisplay from '../components/ParticleDisplay'
import { IGNORED_USERS } from '../utils/constants'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userObject, setUserObject] = useState(null)
  const [dataFinallyLoaded, setDataFinallyLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        let result = await axios.get(
          process.env.NEXT_PUBLIC_ENV === 'development'
            ? `http://localhost:5000/api/excel`
            : `https://tecvex.com/api/excel`,
        )

        const filteredData = result.data.filter(
          (item) => !IGNORED_USERS.includes(item.user),
        )
        setData(filteredData)
        let compiledUserObject = separateByUser(filteredData)

        const filteredUserObject = Object.fromEntries(
          Object.entries(compiledUserObject).filter(
            ([key]) => !IGNORED_USERS.includes(key),
          ),
        )

        setUserObject(filteredUserObject)
        setLoading(false)
        setDataFinallyLoaded(true)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <main className="flex min-h-screen flex-col justify-around relative z-50 ">
        {dataFinallyLoaded && <Header setData={setData} />}

        <DataDisplay data={data} userObject={userObject} />
        <div className="z-0" style={{ position: 'fixed', zIndex: -1000 }}>
          <ParticleDisplay />
        </div>
      </main>
    </>
  )
}
