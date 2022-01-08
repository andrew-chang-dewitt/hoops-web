// represents the response from a Load interface
interface Result {
  status?: number
  redirect?: string
}

interface CheckTokenOptions {
  token?: string
  success?: Result
  failure?: Result
}

// if token exists, return success result, else redirect to failure
export function checkToken(
  {token, success, failure}: CheckTokenOptions
): Result {
  if (token) return success ? success : {} // defaults to no-op

  return failure ? failure : {status: 302, redirect: '/login'} // defaults to /login
}
