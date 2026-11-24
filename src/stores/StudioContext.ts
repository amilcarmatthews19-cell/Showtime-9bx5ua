import { createContext,useContext } from 'react';
import type { useStudioState } from '@/hooks/useStudioState';
export type StudioState = ReturnType<typeof useStudioState>;
export const StudioContext=createContext<StudioState | null>(null);
export function useStudio(){const state=useContext(StudioContext);if(!state)throw new Error('StudioProvider is required');return state;}
