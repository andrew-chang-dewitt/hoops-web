import {browser} from '$app/env'
import {Method} from './_utils'

import type {AccountOut} from './models/account'
import type {Token} from './models/token'
import type {TransactionOut} from './models/transaction'

const apiPath = '/api'

export class FetchError extends Error {
    error: 'FetchError'
    fromErr: unknown

    constructor(message: string, fromErr?: unknown) {
        super(message)
        this.message = message
        this.error = 'FetchError'
        this.fromErr = fromErr
    }
}

export const isFetchError = (o: any): o is FetchError =>
    o.error === 'FetchError'

export interface Fetch {
    (info: RequestInfo, init?: RequestInit): Promise<Response>
}

type Headers = Record<string, string>

interface SendOpts {
    method: Method
    path: string
    host?: string
    token?: string
    data?: {
        contentType: string
        value: string
    }
    headers?: Headers
}

const defaultSendOpts = {
    host: '',
    headers: {
        'accept': 'application/json',
    },
}

const send = async <T>(
    args: SendOpts,
    fetchfn: Fetch,
): Promise<T | FetchError> => {
    const {method, path, token, data} = {
        ...defaultSendOpts,
        ...args,
    }

    let options: RequestInit = {
        method,
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
    const basePath = browser ? apiPath : 'http://localhost' + apiPath
    const fullPath = basePath + path
    // const fullPath = apiPath + path

    return fetchfn(fullPath, options)
        .then((res: Response) =>
            res.ok
                ? res.json()
                : new FetchError(`${res.status} ${res.statusText}`)

        )
        .catch((error: Error) => new FetchError(error.message))
}

export const login = async (
    {username, password}: {username: string, password: string},
    fetchfn: Fetch = fetch,
) =>
    send<Token>({
        method: Method.POST,
        path: `/token`,
        data: {
            contentType: 'application/x-www-form-urlencoded',
            value: `username=${encodeURI(username)}&password=${encodeURI(password)}`,
        }
    }, fetchfn)

interface MethodOpts<T> {
    path: string
    data?: T
    token?: string
}

const post = async <Tin, Tout>(
    {path, data, token}: MethodOpts<Tin>,
    fetchfn: Fetch,
): Promise<Tout | FetchError> =>
    await send<Tout>({
        method: Method.POST,
        data: {
            contentType: 'application/json',
            value: JSON.stringify(data),
        },
        path,
        token,
    }, fetchfn)

const get = async <Tout>(
    // no data arg here, so generic type for MethodOpts doesn't matter
    {path, token}: MethodOpts<unknown>,
    fetchfn: Fetch,
): Promise<Tout | FetchError> =>
    await send<Tout>({
        method: Method.GET,
        path,
        token,
    }, fetchfn)

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
    post: ({data}: {data: UserIn}, fetchfn?: Fetch) =>
        Promise<UserOut | FetchError>
}

export const User: IUser = {
    post: async ({data}, fetchfn = fetch) =>
        post({path: '/user', data}, fetchfn),
}

interface TransactionGetOpts {
    account_id?: string
    payee?: string
    mininmum_amount?: number
    maximum_amount?: number
    after?: string
    before?: string
    limit?: number
    page?: number
    sort?: string
}

interface ITransaction {
    get: (
        {token}: {token: string},
        args: TransactionGetOpts,
        fetchfn?: Fetch) => Promise<TransactionOut[] | FetchError>
    // post: ({data, token}: {data: TransactionIn, token: string}) =>
    //   Promise<TransactionOut | FetchError>
}

const buildTransactionGetPath = (args: TransactionGetOpts): string =>
    args
        ? '?' + Object.entries(args).map(
            ([key, value]) => `${key}=${value}`
        ).join('&')
        : ''

export const Transaction: ITransaction = {
    get: async ({token}, args = {}, fetchfn = fetch) =>
        get<TransactionOut[]>({
            path: `/transaction${buildTransactionGetPath(args)}`,
            token
        }, fetchfn),
}

interface IAccount {
    get: ({token}: {token: string}, fetchfn?: Fetch) =>
        Promise<AccountOut[] | FetchError>
}

export const Account: IAccount = {
    get: async ({token}, fetchfn = fetch) =>
        get<AccountOut[]>({path: '/account', token}, fetchfn)
}

export const validateToken = async (
    token: string,
    fetchfn: Fetch = fetch
): Promise<boolean> => {
    // FIXME: this should be from environment or config instead of hardcoded
    const basePath = browser ? apiPath : 'http://localhost' + apiPath
    // const basePath = apiPath

    return await fetchfn(basePath + '/token', {
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
