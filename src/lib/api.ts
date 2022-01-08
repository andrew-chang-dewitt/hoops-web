import {ok, err} from './utils/Result'
import type {Result} from './utils/Result'

const rootPath = '/api'

export class FetchError extends Error {}

export interface Token {
  access_token: string
  token_type: 'bearer'
}

enum Method {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

type Headers = Record<string, string>

interface SendOpts {
  method: Method
  path: string
  token?: string
  data?: {
    contentType: string
    value: string
  }
  headers?: Headers
}

const send = async <T>(
  {method, path, token, data, headers}: SendOpts
): Promise<Result<T, FetchError>> => {
  let options: RequestInit = {
    method,
    headers: {
      'accept': 'application/json',
      ...headers
    }
  }

  if (data) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': data.contentType,
      },
      body: data.value,
    }
  }

  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': token
    }
  }

  return fetch(rootPath + path, options)
    .then((res: Response) => {
      if (!res.ok) throw new FetchError(`${res.status} ${res.statusText}`)

      return res
    })
    .then((res: Response) => res.json().then((json: T) => ok(json)))
    .catch((error: Error) => err(new FetchError(error.message)))
}

export const login = async (
  {username, password}: {username: string, password: string}
): Promise<Result<Token, FetchError>> =>
  send<Token>({
    method: Method.POST,
    path: `/token`,
    data: {
      contentType: 'application/x-www-form-urlencoded',
      value: `username=${encodeURI(username)}&password=${encodeURI(password)}`,
    }
  })


