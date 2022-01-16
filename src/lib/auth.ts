import {browser} from '$app/env'
import {validateToken} from './api'
import {deleteCookie, expiredCookie} from './_utils'

// represents the response from a Load interface
interface Response {
  status?: number
  redirect?: string
}

const failureResponse = {
  status: 302,
  redirect: '/login',
  headers: {
    'set-cookie': expiredCookie('jwt')
  }
}

// if token exists, return check validity & return success result,
// else redirect to failure
export const checkToken = async (
  token?: string,
  success: Response = {}, // defaults to no-op
  failure: Response = failureResponse, // defaults to /login
): Promise<Response> => {
  // short-circuit to failure redirect if no token
  if (!token) return failure

  // continue with success response if token is valid
  if (await validateToken(token)) return success

  // otherwise proceed to failure

  // first, delete jwt cookie
  if (browser) deleteCookie('jwt', document)

  // then, clear token on session
  // **warning** changing session may trigger a redirect
  // if the calling page's `load()` method redirects on
  // token presence
  token = ''

  // finally, redirect back to login page
  // w/ header to delete cookie as well
  return failure
}
