
import { lazy,Suspense,useEffect } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import StudioProvider from '@/stores/StudioProvider';
import { useStudio } from '@/stores/StudioContext';
import Header from '@/components/layout/Header';
import SettingsModal from '@/components/features/SettingsModal';
import ExportModal from '@/components/features/ExportModal';
import NotFound from '@/pages/NotFound';
import SharedProjectLoader from '@/components/features/SharedProjectLoader';
const Studio=lazy(()=>import('@/pages/Studio'));
const Library=lazy(()=>import('@/pages/Library'));
function StudioShell(){const {dark}=useStudio();useEffect(()=>{document.documentElement.classList.toggle('dark',dark);},[dark]);return <BrowserRouter><SharedProjectLoader/><div className="h-[100dvh] flex flex-col overflow-hidden"><Header/><Suspense fallback={<main className="flex-1 flex items-center justify-center"><p className="micro">Shaping your studio…</p></main>}><Routes><Route path="/" element={<Studio/>}/><Route path="/library" element={<Library/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></div><SettingsModal/><ExportModal/><Toaster position="bottom-right" theme={dark?'dark':'light'} toastOptions={{style:{fontFamily:'Inter, sans-serif',fontSize:'13px',background:'hsl(var(--panel))',color:'hsl(var(--foreground))',border:'1px solid hsl(var(--border))'}}} /></BrowserRouter>;}
export default function App(){return <StudioProvider><StudioShell/></StudioProvider>;}
