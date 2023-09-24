export const separateByUser = (data) => {
  const userObj = data.reduce((acc, cur) => {
    const user = cur.user
    if (!acc[user]) acc[user] = []
    acc[user].push(cur)
    return acc
  }, {})
  return userObj
}
