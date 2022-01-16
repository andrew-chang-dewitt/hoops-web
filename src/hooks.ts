import * as cookie from 'cookie'
import {validateToken} from '$lib/api'

import type {GetSession, Handle} from '@sveltejs/kit'

export const handle: Handle = async ({request, resolve}) => {
  const cookies = cookie.parse(request.headers.cookie || '')
  const token = cookies.jwt

  request.locals.token = (await validateToken(token)) ? token : ''

  return await resolve(request)
}

export const getSession: GetSession = async ({locals}) => ({
  token: locals.token
})
