import { useContext } from 'react'
import { EnergyContext, EnergyDispatchContext } from '../stores/EnergyContext'

export function useEnergyRecords() {
  return useContext(EnergyContext)
}

export function useEnergyDispatch() {
  return useContext(EnergyDispatchContext)
}
