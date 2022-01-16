import type {Token} from '$lib/models/token'

interface ResponseError {
  status?: number
  error: unknown
}

type ResponseBody = Token | ResponseError

const isError = (body: ResponseBody): body is ResponseError =>
  body.hasOwnProperty('error')

export const respond = async (body: ResponseBody) => {
  // short circuit response if body is an Error
  if (isError(body)) {
    return {
      status: body.status ? body.status : 401,
      body: body.error,
    }
  }

  // otherwise, respond with set-cookie header containing token 
  // string & body as token
  return {
    headers: {
      'set-cookie': `jwt=${body.access_token}; Path=/; HttpOnly`
    },
    body,
  }
}
