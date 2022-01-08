import * as cookie from 'cookie'
import type {Handle, GetSession} from '@sveltejs/kit/types/hooks'

export const handle: Handle = async ({request, resolve}) => {
  const cookies = cookie.parse(request.headers.cookie || '')
  const jwt = cookies.jwt && Buffer.from(cookies.jwt, 'base64').toString('utf-8')

  const parsed = jwt ? JSON.parse(jwt) : null
  console.log(`parsed token: ${parsed}`)
  request.locals.token = parsed
  return await resolve(request)
}

export const getSession: GetSession = ({locals}) => ({
  token: locals.token
})
