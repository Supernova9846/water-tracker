'use client'
import { useWaterTracker } from '../hooks/useWaterTracker';

export default function Home() {
  // FIX: Removed 'addManualEntry' because it's not in the hook!
  const { toggleTimer, getActiveSessionFor, getElapsedSeconds, history } = useWaterTracker();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const TimerBox = ({ type }: { type: string }) => {
    const isActive = getActiveSessionFor(type);
    const seconds = getElapsedSeconds(type);
    const flowRate = type === 'shower' ? 2.1 : 1.5;
    const gallons = (seconds / 60) * flowRate;
    const cost = gallons * 0.03;

    return (
      <div className="p-6 m-2 border-2 rounded-2xl bg-white shadow-lg text-center w-64">
        <h2 className="text-2xl font-bold capitalize mb-4 text-gray-800">{type}</h2>
        <div className={`text-4xl font-mono mb-2 ${isActive ? 'text-blue-600' : 'text-gray-300'}`}>
          {formatTime(seconds)}
        </div>
        <div className="flex flex-col text-sm mb-6 font-bold">
          <span className="text-blue-400">{gallons.toFixed(2)} Gal</span>
          <span className="text-green-500">${cost.toFixed(2)} Cost</span>
        </div>
        <button
          onClick={() => toggleTimer(type)}
          className={`w-full py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
        >
          {isActive ? `Stop ${type}` : `Start ${type}`}
        </button>
      </div>
    );
  };

  return (
    <main className="flex flex-col items-center py-12 min-h-screen bg-gray-100 p-4 text-gray-900">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-blue-900 tracking-tight">WaterTracker</h1>
        <p className="text-gray-500 font-medium tracking-wide">Complete Household Monitoring</p>
      </div>

      <div className="flex flex-wrap justify-center mb-12 max-w-5xl">
        <TimerBox type="shower" />
        <TimerBox type="sink" />

        <div className="p-6 m-2 border-2 rounded-2xl bg-white shadow-lg text-center w-64">
          <h2 className="text-2xl font-bold capitalize mb-4 text-gray-800">Toilet</h2>
          <div className="text-4xl font-mono mb-2 text-gray-300 uppercase">Flush</div>
          <div className="flex flex-col text-sm mb-6 font-bold">
            <span className="text-blue-400">1.60 Gal</span>
            <span className="text-green-500">$0.05 Cost</span>
          </div>
          <button
            onClick={() => toggleTimer('toilet')}
            className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all"
          >
            Flush Toilet
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Usage History</h3>
        {history && history.length === 0 ? (
          <p className="text-gray-400 text-center py-4 italic">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {history?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold capitalize text-blue-900">{item.type}</span>
                  <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-mono font-bold text-gray-700">
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
  );
}