/* This example requires Tailwind CSS v2.0+ */
import {
  CalendarIcon,
  LocationMarkerIcon,
  UserIcon,
} from '@heroicons/react/solid'

const Wave = ({ wave }) => (
  <div className="relative flex-col rounded-2xl px-6 sm:px-12 py-10 bg-indigo-500 overflow-hidden shadow-xl">
    <div className="flex-col">
      <div className="flex items-center text-indigo-200">
        <UserIcon className="h-8" />
        <div className="ml-2 text-xl">
          {wave.address.substring(0, 5)}...{wave.address.substring(38)}
        </div>
      </div>
      <div className="mt-2 flex items-center text-indigo-200">
        <CalendarIcon className="h-8" />
        <div className="ml-2 text-xl">{wave.timestamp.toString()}</div>
      </div>
    </div>
    <div className="mt-4 p-4 rounded-md bg-indigo-400 text-indigo-100">{wave.message}</div>
  </div>
)

const WavesList = ({ waves }) => {
  return (
    <div className="mt-8 mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-5xl lg:px-8">
      {waves.map((w) => (
        <Wave key={w.timestamp} wave={w} />
      ))}
    </div>
  )
}

export default WavesList
