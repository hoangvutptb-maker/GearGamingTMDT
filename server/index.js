import { createServer } from 'node:http'
import { handleRequest } from './routes/index.js'

const port = Number(process.env.PORT || 3001)
const server = createServer(handleRequest)

server.listen(port, () => {
  console.log(`GearGamingTMDT API listening on http://localhost:${port}`)
})
