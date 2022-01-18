import {browser} from '$app/env'
import {validateToken} from './api'
import {deleteCookie, expiredCookie} from './_utils'

import type {Fetch} from '$lib/api'

// represents the response from a Load interface
interface Response {
  status?: number
  redirect?: string
}

// type all args to checkToken as obj to allow keyword args
interface CheckTokenOpts {
  token?: string
  success?: Response
  failure?: Response
  fetchfn?: Fetch
}

const failureResponse = {
  status: 302,
  redirect: '/login',
  headers: {
    'set-cookie': expiredCookie('jwt')
  }
}

//default args
const defaultCheckTokenOpts = {
  success: {},
  failure: failureResponse,
  fetchfn: fetch,
}

// if token exists, return check validity & return success result,
// else redirect to failure
export const checkToken = async (args: CheckTokenOpts): Promise<Response> => {
  // spread incoming args over default args to fill any args not 
  // provided w/ default values
  let {token, success, failure, fetchfn} = {
    ...defaultCheckTokenOpts,
    ...args,
  }
  // short-circuit to failure redirect if no token
  if (!token) return failure

  // continue with success response if token is valid
  if (await validateToken(token, fetchfn)) return success

  // otherwise proceed to failure

  // first, delete jwt cookie
  if (browser) deleteCookie('jwt', document)

  // then, clear token on session
  // **warning** changing session may trigger a redirect
  // if the calling page's `load()` method redirects on
  // token presence
  // FIXME: this might be broken now that token is derived from an object built
  // through spread operators, meaning it has been copied. Not sure how that'll
  // impact the reference to the original token prop on the global session
  // object
  token = ''

  // finally, redirect back to login page
  // w/ header to delete cookie as well
  return failure
}
