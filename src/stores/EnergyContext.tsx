import { createContext, useReducer, type ReactNode, type Dispatch } from 'react'
import type { EnergyRecord } from '../types'
import { getRecords, setRecords } from '../utils/storage'

type Action =
  | { type: 'LOAD' }
  | { type: 'ADD'; record: EnergyRecord }
  | { type: 'UPDATE'; record: EnergyRecord }
  | { type: 'DELETE'; id: string }
  | { type: 'SET_ALL'; records: EnergyRecord[] }

function reducer(state: EnergyRecord[], action: Action): EnergyRecord[] {
  let next: EnergyRecord[]
  switch (action.type) {
    case 'LOAD':
      return getRecords()
    case 'ADD':
      next = [action.record, ...state]
      setRecords(next)
      return next
    case 'UPDATE':
      next = state.map((r) => (r.id === action.record.id ? action.record : r))
      setRecords(next)
      return next
    case 'DELETE':
      next = state.filter((r) => r.id !== action.id)
      setRecords(next)
      return next
    case 'SET_ALL':
      setRecords(action.records)
      return action.records
    default:
      return state
  }
}

export const EnergyContext = createContext<EnergyRecord[]>([])
export const EnergyDispatchContext = createContext<Dispatch<Action>>(() => {})

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [records, dispatch] = useReducer(reducer, null, () => getRecords())

  return (
    <EnergyContext.Provider value={records}>
      <EnergyDispatchContext.Provider value={dispatch}>
        {children}
      </EnergyDispatchContext.Provider>
    </EnergyContext.Provider>
  )
}
