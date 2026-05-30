import { useCallback } from 'react'
import { useEnergyDispatch } from '../hooks/useEnergy'
import type { EnergyLevel, EnergyRecord } from '../types'
import { generateUUID } from '../utils/uuid'

type AddData = {
  energy: EnergyLevel
  value: number
  activity: string
  activityTag: string
  person: string
  personTag: string
  note: string
}

export function useRecords() {
  const dispatch = useEnergyDispatch()

  const addRecord = useCallback((data: AddData) => {
    const record: EnergyRecord = { ...data, id: generateUUID(), timestamp: Date.now() }
    dispatch({ type: 'ADD', record })
    return record
  }, [dispatch])

  const updateRecord = useCallback((record: EnergyRecord) => {
    dispatch({ type: 'UPDATE', record })
  }, [dispatch])

  const deleteRecord = useCallback((id: string) => {
    dispatch({ type: 'DELETE', id })
  }, [dispatch])

  const importRecords = useCallback((records: EnergyRecord[]) => {
    dispatch({ type: 'SET_ALL', records })
  }, [dispatch])

  return { addRecord, updateRecord, deleteRecord, importRecords }
}
