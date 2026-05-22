'use client'
import { createContext, useContext, useEffect, useState } from 'react'

// Average residential water cost ($/gallon) by US state — sourced from AWWA survey data.
// Rates represent typical residential tier-1 pricing; actual bills vary by utility and usage tier.
export const STATE_WATER_RATES: Record<string, { name: string; rate: number }> = {
  AL: { name: 'Alabama',        rate: 0.004 },
  AK: { name: 'Alaska',         rate: 0.008 },
  AZ: { name: 'Arizona',        rate: 0.006 },
  AR: { name: 'Arkansas',       rate: 0.003 },
  CA: { name: 'California',     rate: 0.009 },
  CO: { name: 'Colorado',       rate: 0.006 },
  CT: { name: 'Connecticut',    rate: 0.009 },
  DE: { name: 'Delaware',       rate: 0.005 },
  FL: { name: 'Florida',        rate: 0.005 },
  GA: { name: 'Georgia',        rate: 0.005 },
  HI: { name: 'Hawaii',         rate: 0.013 },
  ID: { name: 'Idaho',          rate: 0.004 },
  IL: { name: 'Illinois',       rate: 0.007 },
  IN: { name: 'Indiana',        rate: 0.005 },
  IA: { name: 'Iowa',           rate: 0.005 },
  KS: { name: 'Kansas',         rate: 0.005 },
  KY: { name: 'Kentucky',       rate: 0.004 },
  LA: { name: 'Louisiana',      rate: 0.003 },
  ME: { name: 'Maine',          rate: 0.007 },
  MD: { name: 'Maryland',       rate: 0.007 },
  MA: { name: 'Massachusetts',  rate: 0.010 },
  MI: { name: 'Michigan',       rate: 0.006 },
  MN: { name: 'Minnesota',      rate: 0.005 },
  MS: { name: 'Mississippi',    rate: 0.003 },
  MO: { name: 'Missouri',       rate: 0.005 },
  MT: { name: 'Montana',        rate: 0.005 },
  NE: { name: 'Nebraska',       rate: 0.005 },
  NV: { name: 'Nevada',         rate: 0.006 },
  NH: { name: 'New Hampshire',  rate: 0.007 },
  NJ: { name: 'New Jersey',     rate: 0.008 },
  NM: { name: 'New Mexico',     rate: 0.006 },
  NY: { name: 'New York',       rate: 0.009 },
  NC: { name: 'North Carolina', rate: 0.005 },
  ND: { name: 'North Dakota',   rate: 0.004 },
  OH: { name: 'Ohio',           rate: 0.006 },
  OK: { name: 'Oklahoma',       rate: 0.004 },
  OR: { name: 'Oregon',         rate: 0.007 },
  PA: { name: 'Pennsylvania',   rate: 0.007 },
  RI: { name: 'Rhode Island',   rate: 0.008 },
  SC: { name: 'South Carolina', rate: 0.005 },
  SD: { name: 'South Dakota',   rate: 0.004 },
  TN: { name: 'Tennessee',      rate: 0.004 },
  TX: { name: 'Texas',          rate: 0.006 },
  UT: { name: 'Utah',           rate: 0.005 },
  VT: { name: 'Vermont',        rate: 0.008 },
  VA: { name: 'Virginia',       rate: 0.006 },
  WA: { name: 'Washington',     rate: 0.007 },
  WV: { name: 'West Virginia',  rate: 0.005 },
  WI: { name: 'Wisconsin',      rate: 0.006 },
  WY: { name: 'Wyoming',        rate: 0.004 },
}

// Flow rates in gallons per minute (gpm) for showerheads and faucets,
// gallons per flush (gpf) for toilets.
export interface FixtureModel {
  name: string
  flow: number   // gpm or gpf
  label: string  // short descriptor shown in the UI
}

export const SHOWERHEAD_MODELS: Record<string, FixtureModel> = {
  standard:        { name: 'Standard Showerhead',       flow: 2.5,  label: '2.5 gpm' },
  watersense:      { name: 'WaterSense Certified',       flow: 2.0,  label: '2.0 gpm' },
  moen_attract:    { name: 'Moen Attract',               flow: 1.75, label: '1.75 gpm' },
  delta_in2ition:  { name: 'Delta In2ition',             flow: 1.75, label: '1.75 gpm' },
  kohler_moxie:    { name: 'Kohler Moxie',               flow: 1.75, label: '1.75 gpm' },
  high_efficiency: { name: 'High-Efficiency',            flow: 1.5,  label: '1.5 gpm' },
  ultra_low:       { name: 'Ultra-Low Flow',             flow: 1.25, label: '1.25 gpm' },
}

export const FAUCET_MODELS: Record<string, FixtureModel> = {
  standard:        { name: 'Standard Aerator',           flow: 2.2,  label: '2.2 gpm' },
  delta_essa:      { name: 'Delta Essa',                 flow: 1.8,  label: '1.8 gpm' },
  kohler_simplice: { name: 'Kohler Simplice',            flow: 1.8,  label: '1.8 gpm' },
  watersense:      { name: 'WaterSense Certified',       flow: 1.5,  label: '1.5 gpm' },
  moen_align:      { name: 'Moen Align',                 flow: 1.2,  label: '1.2 gpm' },
  low_flow:        { name: 'Low-Flow Aerator',           flow: 1.0,  label: '1.0 gpm' },
}

export const TOILET_MODELS: Record<string, FixtureModel> = {
  old_standard:    { name: 'Old Standard (pre-1994)',    flow: 3.5,  label: '3.5 gpf' },
  standard:        { name: 'Standard (1994+)',           flow: 1.6,  label: '1.6 gpf' },
  american_std:    { name: 'American Standard Champion', flow: 1.6,  label: '1.6 gpf' },
  toto_drake:      { name: 'TOTO Drake II',              flow: 1.28, label: '1.28 gpf' },
  kohler_cimarron: { name: 'Kohler Cimarron',            flow: 1.28, label: '1.28 gpf' },
  het:             { name: 'High-Efficiency (HET)',      flow: 1.28, label: '1.28 gpf' },
  dual_flush:      { name: 'Dual-Flush (avg)',           flow: 1.1,  label: '1.1 gpf' },
  ultra_high_eff:  { name: 'Ultra-High Efficiency',     flow: 0.8,  label: '0.8 gpf' },
}

const US_AVERAGE_RATE  = 0.006
const DEFAULT_SHOWER   = 'standard'
const DEFAULT_FAUCET   = 'standard'
const DEFAULT_TOILET   = 'standard'

interface SettingsContextValue {
  locationState: string
  costPerGallon: number
  setLocationState: (code: string) => void

  showerModel: string
  sinkModel: string
  toiletModel: string
  showerFlow: number
  sinkFlow: number
  toiletFlow: number
  setShowerModel: (id: string) => void
  setSinkModel: (id: string) => void
  setToiletModel: (id: string) => void
}

const SettingsContext = createContext<SettingsContextValue>({
  locationState: '',
  costPerGallon: US_AVERAGE_RATE,
  setLocationState: () => {},

  showerModel:  DEFAULT_SHOWER,
  sinkModel:    DEFAULT_FAUCET,
  toiletModel:  DEFAULT_TOILET,
  showerFlow:   SHOWERHEAD_MODELS[DEFAULT_SHOWER].flow,
  sinkFlow:     FAUCET_MODELS[DEFAULT_FAUCET].flow,
  toiletFlow:   TOILET_MODELS[DEFAULT_TOILET].flow,
  setShowerModel: () => {},
  setSinkModel:   () => {},
  setToiletModel: () => {},
})

function makeSetter(key: string, setRaw: (v: string) => void) {
  return (value: string) => {
    localStorage.setItem(key, value)
    setRaw(value)
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [locationState, setLocationStateRaw] = useState('')
  const [showerModel,   setShowerModelRaw]   = useState(DEFAULT_SHOWER)
  const [sinkModel,     setSinkModelRaw]     = useState(DEFAULT_FAUCET)
  const [toiletModel,   setToiletModelRaw]   = useState(DEFAULT_TOILET)

  useEffect(() => {
    setLocationStateRaw(localStorage.getItem('locationState') ?? '')
    setShowerModelRaw(localStorage.getItem('showerModel') ?? DEFAULT_SHOWER)
    setSinkModelRaw(localStorage.getItem('sinkModel')    ?? DEFAULT_FAUCET)
    setToiletModelRaw(localStorage.getItem('toiletModel') ?? DEFAULT_TOILET)
  }, [])

  const costPerGallon = locationState
    ? (STATE_WATER_RATES[locationState]?.rate ?? US_AVERAGE_RATE)
    : US_AVERAGE_RATE

  const showerFlow = SHOWERHEAD_MODELS[showerModel]?.flow ?? SHOWERHEAD_MODELS[DEFAULT_SHOWER].flow
  const sinkFlow   = FAUCET_MODELS[sinkModel]?.flow       ?? FAUCET_MODELS[DEFAULT_FAUCET].flow
  const toiletFlow = TOILET_MODELS[toiletModel]?.flow     ?? TOILET_MODELS[DEFAULT_TOILET].flow

  return (
    <SettingsContext.Provider value={{
      locationState,
      costPerGallon,
      setLocationState: makeSetter('locationState', setLocationStateRaw),

      showerModel,
      sinkModel,
      toiletModel,
      showerFlow,
      sinkFlow,
      toiletFlow,
      setShowerModel: makeSetter('showerModel', setShowerModelRaw),
      setSinkModel:   makeSetter('sinkModel',   setSinkModelRaw),
      setToiletModel: makeSetter('toiletModel', setToiletModelRaw),
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
