const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function send(res, statusCode, payload) {
  res.writeHead(statusCode, headers)
  res.end(JSON.stringify(payload))
}

export const success = (res, payload) => send(res, 200, payload)
export const created = (res, payload) => send(res, 201, payload)
export const badRequest = (res, payload) => send(res, 400, payload)
export const unauthorized = (res, payload) => send(res, 401, payload)
export const forbidden = (res, payload) => send(res, 403, payload)
export const notFound = (res, payload) => send(res, 404, payload)
export const conflict = (res, payload) => send(res, 409, payload)
export const serverError = (res, payload) => send(res, 500, payload)

const maxJsonBodyBytes = 1024 * 1024

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    let bodySize = 0
    let bodyTooLarge = false

    req.on('data', (chunk) => {
      bodySize += chunk.length
      if (bodySize > maxJsonBodyBytes) {
        bodyTooLarge = true
        return
      }
      body += chunk
    })
    req.on('end', () => {
      if (bodyTooLarge) {
        reject(new Error('JSON body too large'))
        return
      }
      if (!body) {
        resolve({})
        return
      }
      try {
        const parsedBody = JSON.parse(body)
        if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
          reject(new Error('Invalid JSON body'))
          return
        }
        resolve(parsedBody)
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}
