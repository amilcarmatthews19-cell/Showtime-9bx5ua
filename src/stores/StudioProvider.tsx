import type { ReactNode } from 'react';
import { StudioContext } from '@/stores/StudioContext';
import { useStudioState } from '@/hooks/useStudioState';
interface Props {children:ReactNode;}
export default function StudioProvider({children}:Props){const state=useStudioState();return <StudioContext.Provider value={state}>{children}</StudioContext.Provider>;}
