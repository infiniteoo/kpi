export const calculateUserProfiles = (userObject) => {
  const userProfiles = {}

  for (const user in userObject) {
    if (Object.hasOwnProperty.call(userObject, user)) {
      const actions = userObject[user]

      let totalActions = 0
      let totalTimeBetweenActions = 0
      let lastActionTime = null
      let palletPicks = 0
      let undirectedFullInventoryMoves = 0
      let fluidLoads = 0
      let listPicks = 0
      let trailerLoads = 0
      let asnReceives = 0

      actions.forEach((action) => {
        totalActions++

        // Combine date and time and convert to Date object
        const actionDateTime = new Date(`${action.date} ${action.time}`)

        if (lastActionTime) {
          const timeBetweenActions = actionDateTime - lastActionTime
          totalTimeBetweenActions += timeBetweenActions
        }
        lastActionTime = actionDateTime

        switch (action.activity) {
          case 'Pallet Pick':
            palletPicks++
            break
          case 'Undirected Full Inventory Move':
            undirectedFullInventoryMoves++
            break
          case 'Fluid Load':
            fluidLoads++
            break
          case 'List Pick':
            listPicks++
            break
          case 'Trailer Load':
            trailerLoads++
            break
          case 'Non-Trusted ASN':
            asnReceives++
            break
          default:
            break
        }
      })

      const averageTimeBetweenActions =
        totalActions > 1 ? totalTimeBetweenActions / (totalActions - 1) : 0

      userProfiles[user] = {
        totalActions,
        averageTimeBetweenActions,
        palletPicks,
        undirectedFullInventoryMoves,
        fluidLoads,
        listPicks,
        trailerLoads,
        asnReceives,
      }
    }
  }

  return userProfiles
}
