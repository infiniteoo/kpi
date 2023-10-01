const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const XLSX = require('xlsx')
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' }) // This specifies the directory where uploaded files will be stored.
const fs = require('fs')

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

app.post(
  '/api/uploaded-file',
  upload.single('uploadedFile'),
  async (req, res) => {
    try {
      /*  console.log('req.file: ', req.file) // This will log the uploaded file's details. */

      if (!req.file) {
        return res.status(400).send('No file uploaded')
      }

      const filePath = req.file.path // Get the path of the uploaded file
      const workbook = XLSX.readFile(filePath) // Read the uploaded file

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      const excelData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: true,
      })

      if (excelData.length > 0 && Array.isArray(excelData[0])) {
        excelData.shift() // Remove the header row if it exists
      }

      const formattedData = excelData.map((row) => {
        const [date, time, user] = row[0].split(' ')
        let strippedUser = (user.match(/[A-Z]+/g) || []).join('')
        const [activity, operation] = row[1].split('\n')
        const item = row[2]
        let warehouse = ''
        let strippedItem = ''
        let choppedItem = ''

        if (item === 3006 || item.includes('3006')) {
          warehouse = '3006'
        }

        if (typeof item === 'string' && item.includes('3006')) {
          strippedItem = item.replace('3006', '')
          if (strippedItem.includes('\n')) {
            finalStrippedItem = strippedItem.replace('\n', '')
          } else {
            finalStrippedItem = strippedItem
          }
          choppedItem = finalStrippedItem.replace(/\s+/g, '')
        }

        const quantity = row[3]
        const moveUOM = row[4]

        const lpnData = row[5]
        let lpn = ''
        let destinationLPN = ''
        if (typeof lpnData === 'string' && lpnData.includes('\n')) {
          lpn = lpnData.split('\n')[0]
          destinationLPN = lpnData.split('\n')[1]
        } else {
          lpn = lpnData
        }

        let subLPNdata = row[6]
        let subLPN = ''
        let destinationSubLPN = ''

        if (typeof subLPNdata === 'string' && subLPNdata.includes('\n')) {
          subLPN = subLPNdata.split('\n')[0]
          destinationSubLPN = subLPNdata.split('\n')[1]
        } else {
          subLPN = subLPNdata
        }

        let detailLPNData = row[7]
        let detailLPN = ''
        let destinationDetailLPN = ''

        if (typeof detailLPNData === 'string' && detailLPNData.includes('\n')) {
          detailLPN = detailLPNData.split('\n')[0]
          destinationDetailLPN = detailLPNData.split('\n')[1]
        } else {
          detailLPN = detailLPNData
        }

        let sourceLocationData = row[8]
        let sourceLocation = ''
        let destinationLocation = ''

        if (
          typeof sourceLocationData === 'string' &&
          sourceLocationData.includes('\n')
        ) {
          sourceLocation = sourceLocationData.split('\n')[0]
          destinationLocation = sourceLocationData.split('\n')[1]
        } else {
          sourceLocation = sourceLocationData
        }

        let sourceAreaData = row[9]
        let sourceArea = ''
        let destinationArea = ''

        if (
          typeof sourceAreaData === 'string' &&
          sourceAreaData.includes('\n')
        ) {
          sourceArea = sourceAreaData.split('\n')[0]
          destinationArea = sourceAreaData.split('\n')[1]
        } else {
          sourceArea = sourceAreaData
        }

        return {
          date,
          time,
          user: strippedUser,
          activity,
          operation,
          itemNumber: choppedItem,
          warehouse,
          quantity,
          moveUOM,
          lpn,
          destinationLPN,
          subLPN,
          destinationSubLPN,
          detailLPN,
          destinationDetailLPN,
          sourceLocation,
          destinationLocation,
          sourceArea,
          destinationArea,
        }
      })
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err)
      })

      res.json(formattedData) // Send the processed data back to the client
    } catch (error) {
      console.error('Error processing file:', error)
      res.status(500).send('Error processing file')
    }
  },
)

app.get('/api/excel', async (req, res) => {
  const filePath = path.join(__dirname, '/inventory.csv')
  const workbook = XLSX.readFile(filePath)

  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  const excelData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: true,
  })

  if (excelData.length > 0 && Array.isArray(excelData[0])) {
    excelData.shift() // Remove the header row if it exists
  }

  // Only process the first 5 rows
  /*  const firstFiveRows = excelData.slice(105, 110) */

  const formattedData = excelData.map((row) => {
    const [date, time, user] = row[0].split(' ')
    let strippedUser = (user.match(/[A-Z]+/g) || []).join('')
    const [activity, operation] = row[1].split('\n')
    const item = row[2]
    let warehouse = ''
    let strippedItem = ''
    let choppedItem = ''

    if (item === 3006 || item.includes('3006')) {
      warehouse = '3006'
    }

    if (typeof item === 'string' && item.includes('3006')) {
      strippedItem = item.replace('3006', '')
      if (strippedItem.includes('\n')) {
        finalStrippedItem = strippedItem.replace('\n', '')
      } else {
        finalStrippedItem = strippedItem
      }
      choppedItem = finalStrippedItem.replace(/\s+/g, '')
    }

    const quantity = row[3]
    const moveUOM = row[4]

    const lpnData = row[5]
    let lpn = ''
    let destinationLPN = ''
    if (typeof lpnData === 'string' && lpnData.includes('\n')) {
      lpn = lpnData.split('\n')[0]
      destinationLPN = lpnData.split('\n')[1]
    } else {
      lpn = lpnData
    }

    let subLPNdata = row[6]
    let subLPN = ''
    let destinationSubLPN = ''

    if (typeof subLPNdata === 'string' && subLPNdata.includes('\n')) {
      subLPN = subLPNdata.split('\n')[0]
      destinationSubLPN = subLPNdata.split('\n')[1]
    } else {
      subLPN = subLPNdata
    }

    let detailLPNData = row[7]
    let detailLPN = ''
    let destinationDetailLPN = ''

    if (typeof detailLPNData === 'string' && detailLPNData.includes('\n')) {
      detailLPN = detailLPNData.split('\n')[0]
      destinationDetailLPN = detailLPNData.split('\n')[1]
    } else {
      detailLPN = detailLPNData
    }

    let sourceLocationData = row[8]
    let sourceLocation = ''
    let destinationLocation = ''

    if (
      typeof sourceLocationData === 'string' &&
      sourceLocationData.includes('\n')
    ) {
      sourceLocation = sourceLocationData.split('\n')[0]
      destinationLocation = sourceLocationData.split('\n')[1]
    } else {
      sourceLocation = sourceLocationData
    }

    let sourceAreaData = row[9]
    let sourceArea = ''
    let destinationArea = ''

    if (typeof sourceAreaData === 'string' && sourceAreaData.includes('\n')) {
      sourceArea = sourceAreaData.split('\n')[0]
      destinationArea = sourceAreaData.split('\n')[1]
    } else {
      sourceArea = sourceAreaData
    }

    return {
      date,
      time,
      user: strippedUser,
      activity,
      operation,
      itemNumber: choppedItem,
      warehouse,
      quantity,
      moveUOM,
      lpn,
      destinationLPN,
      subLPN,
      destinationSubLPN,
      detailLPN,
      destinationDetailLPN,
      sourceLocation,
      destinationLocation,
      sourceArea,
      destinationArea,
    }
  })

  res.json(formattedData)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
