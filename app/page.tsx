'use client'
import Link from 'next/link'
import { useSettings } from '../context/SettingsContext'
import { useWaterTracker } from '../hooks/useWaterTracker'

export default function Home() {
  const { costPerGallon, showerFlow, sinkFlow, toiletFlow } = useSettings()
  const { toggleTimer, getActiveSessionFor, getElapsedSeconds, history } = useWaterTracker({
    costPerGallon,
    showerFlow,
    sinkFlow,
    toiletFlow,
  })

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const TimerBox = ({ type }: { type: string }) => {
    const isActive = getActiveSessionFor(type)
    const seconds = getElapsedSeconds(type)
    const flowRate = type === 'shower' ? showerFlow : sinkFlow
    const gallons = (seconds / 60) * flowRate
    const cost = gallons * costPerGallon

    return (
      <div className="p-6 m-2 border-2 rounded-2xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg text-center w-64">
        <h2 className="text-2xl font-bold capitalize mb-4 text-gray-800 dark:text-gray-100">{type}</h2>
        <div className={`text-4xl font-mono mb-2 ${isActive ? 'text-blue-600' : 'text-gray-300 dark:text-gray-600'}`}>
          {formatTime(seconds)}
        </div>
        <div className="flex flex-col text-sm mb-6 font-bold">
          <span className="text-blue-400">{gallons.toFixed(2)} Gal</span>
          <span className="text-green-500">${cost.toFixed(2)} Cost</span>
        </div>
        <button
          onClick={() => toggleTimer(type)}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isActive ? `Stop ${type}` : `Start ${type}`}
        </button>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center py-12 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
      <div className="text-center mb-10 relative w-full max-w-5xl">
        <Link
          href="/settings"
          aria-label="Settings"
          className="absolute right-0 top-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
        <h1 className="text-4xl font-black text-blue-900 dark:text-blue-300 tracking-tight">WaterTracker</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Complete Household Monitoring</p>
      </div>

      <div className="flex flex-wrap justify-center mb-12 max-w-5xl">
        <TimerBox type="shower" />
        <TimerBox type="sink" />

        <div className="p-6 m-2 border-2 rounded-2xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg text-center w-64">
          <h2 className="text-2xl font-bold capitalize mb-4 text-gray-800 dark:text-gray-100">Toilet</h2>
          <div className="text-4xl font-mono mb-2 text-gray-300 dark:text-gray-600 uppercase">Flush</div>
          <div className="flex flex-col text-sm mb-6 font-bold">
            <span className="text-blue-400">{toiletFlow.toFixed(2)} Gal</span>
            <span className="text-green-500">${(toiletFlow * costPerGallon).toFixed(3)} Cost</span>
          </div>
          <button
            onClick={() => toggleTimer('toilet')}
            className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all"
          >
            Flush Toilet
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Usage History</h3>
        {history && history.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-4 italic">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {history?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                <div>
                  <span className="font-bold capitalize text-blue-900 dark:text-blue-300">{item.type}</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-mono font-bold text-gray-700 dark:text-gray-300">
                    {item.type === 'toilet' ? 'Instant' : formatTime(item.duration)}
                  </p>
                  <p className="text-blue-500 text-xs">{item.gallons.toFixed(2)} gal • <span className="text-green-600">${item.cost.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
