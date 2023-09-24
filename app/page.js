'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { separateByUser } from '../utils/dataManipulation'
import DataDisplay from '../components/DataDisplay'
import logo from '../public/keyperformance.png'
import Image from 'next/image' // Next.js Image component for optimized images
import { keyframes } from '@emotion/react' // Importing keyframes from Emotion
import styled from '@emotion/styled' // Importing styled from Emotion

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
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <AnimatedLogo src={logo} alt="Logo" width={300} height={160} />
      <DataDisplay />
    </main>
  )
}
