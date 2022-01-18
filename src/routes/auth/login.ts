import {login} from '$lib/api'
import {respond} from './_respond'

import type {Request} from '@sveltejs/kit'

interface LoginBody {
    username: string
    password: string
}

// typing the function runs into a rat's nest of typing issues in SvelteKit
// instead, type only the request argument allows for easily setting the body
// type correctly w/out any issues
// export const post: RequestHandler<void, LoginBody, Token> = async (req) => {
export const post = async (req: Request<void, LoginBody>) => {
    // guard against empty body
    if (!req.body) return {
        status: 422,
        error: new Error("No body in login request")
    }

    let body: LoginBody = req.body

    // guard against missing username and password props
    if (!body.username || !body.password) return {
        status: 422,
        error: new Error(
            'Body must contain username & password properties'
        )
    }

    // TODO: find way to pass this url to fetch to get hostname correct
    console.log(`req.url: ${req.url}`)
    // make call to backend api to get auth token
    const token = await login({
        username: body.username,
        password: body.password
    })

    return respond(token)
}
