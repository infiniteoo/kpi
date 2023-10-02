import { useState, useEffect } from 'react'
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns'
import { calculateUserProfiles } from '../utils/userProfiles'
import { weights } from '../utils/constants'

export const useData = (data, userObject) => {
  const [weeks, setWeeks] = useState([])
  const [filteredData, setFilteredData] = useState(data || [])
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [userProfiles, setUserProfiles] = useState([])

  function convertToSeconds(timeStr) {
    const parts = timeStr.split(' ')
    let seconds = 0
    parts.forEach((part) => {
      if (part.endsWith('m')) {
        seconds += parseInt(part) * 60 // convert minutes to seconds
      } else if (part.endsWith('s')) {
        seconds += parseInt(part) // add seconds
      }
    })
    return seconds
  }

  useEffect(() => {
    const profiles = calculateUserProfiles(userObject)

    // Calculate scores for each user
    const scoredProfiles = Object.entries(profiles).map(([user, profile]) => {
      let score = 0
      score += profile.totalActions * weights.totalActions
      score +=
        convertToSeconds(profile.averageTimeBetweenActions) *
        weights.avgTimeBetweenActions
      score += profile.palletPicks * weights.palletPicks
      score +=
        profile.undirectedFullInventoryMoves *
        weights.undirectedFullInventoryMoves
      score += profile.fluidLoads * weights.fluidLoads
      score += profile.listPicks * weights.listPicks
      score += profile.trailerLoads * weights.trailerLoads
      score += profile.asnReceives * weights.asnReceives

      return { user, score, ...profile }
    })

    const rankedProfiles = scoredProfiles.sort((a, b) => b.score - a.score)
    setUserProfiles(rankedProfiles)
  }, [userObject])

  useEffect(() => {
    if (!data || data.length === 0) return
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    )

    // Find the start date of the first week and the end date of the last week
    let startDate = startOfWeek(new Date(sortedData[0].date))
    const endDate = endOfWeek(new Date(sortedData[sortedData.length - 1].date))

    const calculatedWeeks = []

    // Iterate over each week between the start and end dates
    while (startDate <= endDate) {
      const weekEndDate = endOfWeek(new Date(startDate))
      calculatedWeeks.push({
        start: new Date(startDate),
        end: new Date(weekEndDate),
      })
      startDate = addWeeks(new Date(startDate), 1) // Move to the next week
    }
    setWeeks(calculatedWeeks)
  }, [data])

  useEffect(() => {
    if (selectedDay !== null) {
      setFilteredData(
        filteredData.filter(
          (item) => format(new Date(item.date), 'MMMM do yyyy') === selectedDay,
        ),
      )
    } else {
      // Reset to the data of the selected week or all data if no week is selected
      setFilteredData(
        selectedWeek !== null
          ? data.filter(
              (item) =>
                new Date(item.date) >= weeks[selectedWeek].start &&
                new Date(item.date) <= weeks[selectedWeek].end,
            )
          : data,
      )
    }
  }, [selectedDay, selectedWeek, data, weeks])

  return {
    weeks,
    filteredData,
    selectedWeek,
    setSelectedWeek,
    selectedDay,
    setSelectedDay,
    userProfiles,
  }
}
