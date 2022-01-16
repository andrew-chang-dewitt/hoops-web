export enum Method {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class ResponseError extends Error {
  status: number
  statusText: string
  response: unknown

  constructor(status: number, statusText: string, response: unknown) {
    const message = `ResponseError ${status}: ${statusText}`
    super(message)
    this.status = status
    this.statusText = statusText
    this.response = response
  }
}

const cookieExists = (name: string, doc: Document): boolean =>
  doc.cookie.split(';').some(
    cookie => cookie.trim().startsWith(name + '=')
  )

const path = 'Path=/'
const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT'

export const expiredCookie = (name: string): string =>
  [`${name}=deleted`, path, expires].join(';')

export function deleteCookie(name: string, doc: Document): void {

  if (cookieExists(name, doc)) {
    doc.cookie = expiredCookie(name)
  }
}
