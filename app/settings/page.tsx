'use client'
import Link from 'next/link'
import { useTheme } from '../../context/ThemeContext'
import {
  useSettings,
  STATE_WATER_RATES,
  SHOWERHEAD_MODELS,
  FAUCET_MODELS,
  TOILET_MODELS,
} from '../../context/SettingsContext'

const SORTED_STATES = Object.entries(STATE_WATER_RATES).sort((a, b) =>
  a[1].name.localeCompare(b[1].name)
)

function FixtureSelect({
  id,
  label,
  unit,
  models,
  value,
  onChange,
}: {
  id: string
  label: string
  unit: string
  models: Record<string, { name: string; flow: number; label: string }>
  value: string
  onChange: (id: string) => void
}) {
  const selected = models[value]
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(models).map(([key, model]) => (
          <option key={key} value={key}>{model.name}</option>
        ))}
      </select>
      {selected && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
          {selected.flow} {unit}
        </p>
      )}
    </div>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const {
    locationState, costPerGallon, setLocationState,
    showerModel, sinkModel, toiletModel,
    setShowerModel, setSinkModel, setToiletModel,
  } = useSettings()

  return (
    <main className="flex flex-col items-center py-12 min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-black text-blue-900 dark:text-blue-300 tracking-tight">
            Settings
          </h1>
        </div>

        {/* Location */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            Location
          </h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State
              </label>
              <select
                id="state-select"
                value={locationState}
                onChange={e => setLocationState(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select your state —</option>
                {SORTED_STATES.map(([code, { name }]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Water rate used</p>
              <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                ${costPerGallon.toFixed(4)} / gal
                {!locationState && (
                  <span className="ml-1 text-xs text-gray-400 font-normal">(US avg)</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Fixtures */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            Fixtures
          </h2>
          <div className="space-y-5">
            <FixtureSelect
              id="shower-select"
              label="Showerhead"
              unit="gpm"
              models={SHOWERHEAD_MODELS}
              value={showerModel}
              onChange={setShowerModel}
            />
            <FixtureSelect
              id="faucet-select"
              label="Faucet / Sink"
              unit="gpm"
              models={FAUCET_MODELS}
              value={sinkModel}
              onChange={setSinkModel}
            />
            <FixtureSelect
              id="toilet-select"
              label="Toilet"
              unit="gpf"
              models={TOILET_MODELS}
              value={toiletModel}
              onChange={setToiletModel}
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            Appearance
          </h2>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
