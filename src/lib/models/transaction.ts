interface TransactionBase {
  amount: number
  description: string
  payee: string
  timestamp: string
  account_id: string
  spent_from?: string
}
export interface TransactionIn extends TransactionBase {}
export interface TransactionOut extends TransactionBase {
  id: string
}
