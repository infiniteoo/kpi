const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const XLSX = require('xlsx')
const path = require('path')
const cors = require('cors')
app.use(cors())

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // Adjust this based on your requirements
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})
// Middleware setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Serve static files from the "public" directory
app.use(express.static('public'))

function excelDateToJSDate(excelDate) {
  return new Date(
    (excelDate - 1) * 24 * 60 * 60 * 1000 + new Date('1900-01-01').getTime(),
  )
}

function excelTimeToFormattedTime(excelTime) {
  if (excelTime < 1) {
    const hours = Math.floor(excelTime * 24)
    const minutes = Math.round((excelTime * 24 - hours) * 60)
    const formattedTime = `${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    return formattedTime
  } else {
    return '' // Handle other cases as needed
  }
}

function excelDateToJSDate(excelDate) {
  return new Date(
    (excelDate - 1) * 24 * 60 * 60 * 1000 + new Date('1900-01-01').getTime(),
  )
}

app.get('/api/excel', (req, res) => {
  console.log('hello from api excel')
  // Define the path to your XLSX file
  const filePath = path.join(__dirname, '/inventory.csv')

  // Read the XLSX file
  const workbook = XLSX.readFile(filePath)

  // Assuming a single sheet, you can access it by name
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  // Convert the worksheet to an array of objects, preserving order
  const excelData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: true,
  })

  // Remove the header row if it exists
  if (excelData.length > 0 && Array.isArray(excelData[0])) {
    excelData.shift()
  }

  console.log(excelData)

  // Convert Excel date serial numbers to Date objects
  const dateColumns = ['DateColumn1', 'DateColumn2'] // Replace with actual column names
  excelData.forEach((row) => {
    dateColumns.forEach((columnName) => {
      const columnIndex = excelData[0].indexOf(columnName)
      if (columnIndex !== -1) {
        row[columnIndex] = excelDateToJSDate(row[columnIndex])
      }
    })
  })

  // Convert Excel time fractions to formatted time strings
  const timeColumns = ['TimeColumn1', 'TimeColumn2'] // Replace with actual column names
  excelData.forEach((row) => {
    timeColumns.forEach((columnName) => {
      const columnIndex = excelData[0].indexOf(columnName)
      if (columnIndex !== -1) {
        row[columnIndex] = excelTimeToFormattedTime(row[columnIndex])
      }
    })
  })

  // Send the JSON data as a response

  res.json(excelData)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
