import {browser} from '$app/env'
import {Method} from './_utils'

import type {Token} from './models/token'

const rootPath = '/api'

export class FetchError extends Error {
  error: 'FetchError'

  constructor(message: string) {
    super(message)
    this.message = message
    this.error = 'FetchError'
  }
}

export const isFetchError = (o: any): o is FetchError =>
  o.error === 'FetchError'

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
): Promise<T | FetchError> => {
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
      'Authorization': `Bearer ${token}`
    }
  }

  // FIXME: this should be from environment or config instead of hardcoded
  const basePath = browser ? rootPath : 'http://localhost' + rootPath
  const fullPath = basePath + path

  return fetch(fullPath, options)
    .then((res: Response) => {
      if (!res.ok) throw new FetchError(`${res.status} ${res.statusText}`)

      return res.json()
    })
    .catch((error: Error) => new FetchError(error.message))
}

export const login = async (
  {username, password}: {username: string, password: string}
) =>
  send<Token>({
    method: Method.POST,
    path: `/token`,
    data: {
      contentType: 'application/x-www-form-urlencoded',
      value: `username=${encodeURI(username)}&password=${encodeURI(password)}`,
    }
  })

interface MethodOpts<T> {
  path: string
  data?: T
  token: string
}

const post = async <Tin, Tout>(
  {path, data, token}: MethodOpts<Tin>
): Promise<Tout | FetchError> =>
  await send<Tout>({
    method: Method.POST,
    data: {
      contentType: 'application/json',
      value: JSON.stringify(data),
    },
    path,
    token,
  })

const get = async <Tout>(
  // no data arg here, so generic type for MethodOpts doesn't matter
  {path, token}: MethodOpts<unknown>
): Promise<Tout | FetchError> =>
  await send<Tout>({
    method: Method.GET,
    path,
    token,
  })

interface UserBase {
  handle: string
  full_name: string
  preferred_name: string
}
interface UserIn extends UserBase {
  password: string
}
interface UserOut extends UserBase {}

interface IUser {
  post: ({data, token}: {data: UserIn, token: string}) => Promise<UserOut | FetchError>
}

export const User: IUser = {
  post: async ({data, token}) => post({path: '/user', data, token}),
}

interface TransactionBase {
  amount: number
  description: string
  payee: string
  timestamp: string
  account_id: string
  spent_from?: string
}
interface TransactionIn extends TransactionBase {}
interface TransactionOut extends TransactionBase {
  id: string
}
interface ITransaction {
  get: ({token}: {token: string}) =>
    Promise<TransactionOut[] | FetchError>
  // post: ({data, token}: {data: TransactionIn, token: string}) =>
  //   Promise<TransactionOut | FetchError>
}

export const Transaction: ITransaction = {
  get: async ({token}) =>
    get<TransactionOut[]>({path: '/transaction', token}),
}

interface AccountBase {
  name: string
}
interface AccountIn extends AccountBase {}
interface AccountOut extends AccountBase {
  id: string
  user_id: string
  closed: boolean
}
interface IAccount {
  get: ({token}: {token: string}) => Promise<AccountOut[] | FetchError>
}

export const Account: IAccount = {
  get: async ({token}) => get<AccountOut[]>({path: '/account', token})
}

export const validateToken = async (token: string): Promise<boolean> => {
  // FIXME: this should be from environment or config instead of hardcoded
  const basePath = browser ? rootPath : 'http://localhost' + rootPath

  return await fetch(basePath + '/token', {
    method: Method.GET,
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => {
    if (res.ok) return true

    if (res.status === 401) return false

    throw new FetchError(`${res.status} ${res.statusText}`)
  })
}
