import {expiredCookie} from '$lib/_utils'

export const post = () => ({
  headers: {
    'set-cookie': expiredCookie('jwt')
  },
  body: {
    ok: true
  },
})
