import cors from 'cors'
import express from 'express'

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.use(cors())
app.use(express.json())

app.get('/health', (_request, response) => {
  response.json({
    name: 'Mapa Solidario Maceio API',
    status: 'ok',
  })
})

app.listen(port, () => {
  console.log(`Mapa Solidario Maceio API running on http://localhost:${port}`)
})
