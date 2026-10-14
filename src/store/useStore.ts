import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { assetIds, defaultGrowth, presets, rebalance, validAllocation } from '../utils/finance';
import type { Allocation, AssetId, GrowthInputs } from '../utils/finance';

export type Mode = 'world' | 'portfolio' | 'growth' | 'risk' | 'compare' | 'learn';
export type Lang = 'en' | 'fa';
type Quality = 'auto' | 'high' | 'low';
interface State {
  lang: Lang; mode: Mode; selected: AssetId | null; allocation: Allocation; preset: string;
  budget: number; growth: GrowthInputs; bookmarks: AssetId[]; comparison: AssetId[];
  quality: Quality; reduced: boolean; sound: boolean; currency: 'USD' | 'EUR' | 'IRR';
  tour: boolean; tourIndex: number; settings: boolean; sceneRevision: number;
  shock: string; severity: number; leverage: number; fx: number; foreign: number;
  set: (value: Partial<State>) => void;
  select: (id: AssetId | null) => void;
  allocate: (id: AssetId, value: number) => void;
  applyPreset: (key: string) => void;
  bookmark: (id: AssetId) => void;
  compare: (id: AssetId) => void;
  reset: () => void;
}
const reducedPreference = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const useStore = create<State>()(persist((set, get) => ({
  lang: 'en', mode: 'world', selected: null, allocation: { ...presets.balanced }, preset: 'balanced',
  budget: 10000, growth: { ...defaultGrowth }, bookmarks: [], comparison: ['stocks', 'bonds', 'gold'],
  quality: 'auto', reduced: reducedPreference, sound: false, currency: 'USD',
  tour: false, tourIndex: 0, settings: false, sceneRevision: 0,
  shock: 'downturn', severity: 1, leverage: 1, fx: 0, foreign: 0,
  set: value => set(value),
  select: id => { playClick(get().sound); set({ selected: id, sceneRevision: get().sceneRevision + 1 }); },
  allocate: (id, value) => set({ allocation: rebalance(get().allocation, id, value), preset: 'custom' }),
  applyPreset: key => { if (presets[key]) set({ allocation: { ...presets[key] }, preset: key }); },
  bookmark: id => set({ bookmarks: get().bookmarks.includes(id) ? get().bookmarks.filter(x => x !== id) : [...get().bookmarks, id] }),
  compare: id => set({ comparison: get().comparison.includes(id) ? get().comparison.filter(x => x !== id) : get().comparison.length < 3 ? [...get().comparison, id] : get().comparison }),
  reset: () => set({ allocation: { ...presets.balanced }, preset: 'balanced', budget: 10000, growth: { ...defaultGrowth }, selected: null, tour: false, sceneRevision: get().sceneRevision + 1, shock:'downturn',severity:1,leverage:1,fx:0,foreign:0 }),
}), {
  name: 'investverse-v1', version: 1,
  storage: createJSONStorage(() => localStorage),
  partialize: s => ({ lang: s.lang, allocation: s.allocation, preset: s.preset, bookmarks: s.bookmarks, quality: s.quality, reduced: s.reduced, sound: s.sound, currency: s.currency }),
  merge: (persisted, current) => {
    const p = persisted as Partial<State> | undefined;
    if (!p || typeof p !== 'object') return current;
    return { ...current,
      lang: p.lang === 'fa' ? 'fa' : 'en',
      allocation: validAllocation(p.allocation) ? p.allocation : current.allocation,
      preset: ['conservative','balanced','growth','custom'].includes(p.preset ?? '') ? p.preset! : 'balanced',
      bookmarks: Array.isArray(p.bookmarks) ? p.bookmarks.filter(x => assetIds.includes(x)) : [],
      quality: p.quality === 'high' || p.quality === 'low' ? p.quality : 'auto',
      reduced: typeof p.reduced === 'boolean' ? p.reduced : current.reduced,
      sound: p.sound === true,
      currency: p.currency === 'EUR' || p.currency === 'IRR' ? p.currency : 'USD',
    };
  },
}));

let audio: AudioContext | undefined;
export function playClick(enabled: boolean) {
  if (!enabled) return;
  try {
    audio ??= new AudioContext();
    void audio.resume();
    const osc = audio.createOscillator(); const gain = audio.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(720, audio.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audio.currentTime + .07);
    gain.gain.setValueAtTime(.035, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .1);
    osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + .1);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  } catch { /* Browsers without audio still support every feature. */ }
}
