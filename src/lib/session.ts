import type {LoadInput} from '@sveltejs/kit'

interface User {
  id: string
  username: string
  fullName: string
  givenName?: string
}

interface Session {
  token?: string
  user?: User
}

export interface Input extends LoadInput {
  session: Session
}
