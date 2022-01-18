interface AccountBase {
  name: string
}
export interface AccountIn extends AccountBase {}
export interface AccountOut extends AccountBase {
  id: string
  user_id: string
  closed: boolean
}
