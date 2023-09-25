'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { separateByUser } from '../utils/dataManipulation'
import Header from '../components/Header' //
import DataDisplay from '../components/DataDisplayTemp.jsx'
import Image from 'next/image'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import ParticleDisplay from '../components/ParticleDisplay'

// Define the keyframes for the sliding animation
const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

// Styled Image component with the sliding animation
const AnimatedLogo = styled(Image)`
  animation: ${slideIn} 2s ease-out forwards;
`

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
        setData(result.data)
        let compiledUserObject = separateByUser(result.data)
        console.log('user object', compiledUserObject)
        setUserObject(compiledUserObject)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-around relative z-50 ">
        {dataFinallyLoaded && <Header />}

        <DataDisplay data={data} userObject={userObject} />
        <div style={{ position: 'fixed', zIndex: -10 }}>
          <ParticleDisplay />
        </div>
      </main>
    </>
  )
}
