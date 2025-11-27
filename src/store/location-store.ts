import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LocationInfo } from '@/types/locationInfo'

const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in ms

type LocationStore = {
  location: { lat: number; lon: number } | null
  locationInfo: LocationInfo | null
  timestamp: number | null
  setLocationInfo: (locationInfo: LocationInfo | null) => void
  setLocation: (location: { lat: number; lon: number } | null) => void
}

const useLocation = create<LocationStore>()(
  persist(
    (set) => ({
      location: null,
      locationInfo: null,
      timestamp: null,

      setLocationInfo: (locationInfo) =>
        set({ locationInfo, timestamp: Date.now() }),

      setLocation: (location) =>
        set({ location, timestamp: Date.now() }),
    }),
    {
      name: 'location-store',

      // Validate expiry before restoring state
      merge: (persistedState, currentState) => {
        const data = persistedState as LocationStore;

        if (!data || !data.timestamp) return { ...currentState };

        const isExpired = Date.now() - data.timestamp > EXPIRY_TIME;

        if (isExpired) {
          // Clear expired state
          return { 
            ...currentState,
            location: null,
            locationInfo: null,
            timestamp: null
          };
        }

        return { ...currentState, ...data };
      },
    }
  )
)

export default useLocation;
