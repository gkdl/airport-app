import { create } from 'zustand';

interface AppState {
  deviceId: string | null;
  defaultAirport: string;
  isNotificationOn: boolean;
  setDeviceId: (id: string) => void;
  setDefaultAirport: (code: string) => void;
  toggleNotification: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  deviceId: null,
  defaultAirport: 'ICN',
  isNotificationOn: true,
  setDeviceId: (id) => set({ deviceId: id }),
  setDefaultAirport: (code) => set({ defaultAirport: code }),
  toggleNotification: () => set((s) => ({ isNotificationOn: !s.isNotificationOn })),
}));
