'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { separateByUser } from '../utils/dataManipulation'
import Header from '../components/Header'
import DataDisplay from '../components/Data.jsx'

import ParticleDisplay from '../components/ParticleDisplay'

// Define the keyframes for the sliding animation

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userObject, setUserObject] = useState(null)
  const [dataFinallyLoaded, setDataFinallyLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let result = await axios.get('http://localhost:5000/api/excel')
        setLoading(false)
        setDataFinallyLoaded(true)
        const filteredData = result.data.filter(
          (item) =>
            ![
              'ACONKLE',
              'EPARK',
              'CTYNDALL',
              'BNELSEN',
              'KSILVERS',
              'GBRENNAN',
            ].includes(item.user),
        )
        setData(filteredData)
        let compiledUserObject = separateByUser(filteredData)

        const filteredUserObject = Object.fromEntries(
          Object.entries(compiledUserObject).filter(
            ([key]) =>
              ![
                'ACONKLE',
                'EPARK',
                'CTYNDALL',
                'BNELSEN',
                'KSILVERS',
                'GBRENNAN',
              ].includes(key),
          ),
        )

        setUserObject(filteredUserObject)
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
