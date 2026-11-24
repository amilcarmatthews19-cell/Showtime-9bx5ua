import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMobileView } from '@/hooks/useMobileView';
import { usePageVisible } from '@/hooks/usePageVisible';
import { useStudio } from '@/stores/StudioContext';
import StudioModel from '@/components/features/StudioModel';
import StudioEnvironment from '@/components/features/StudioEnvironment';
import CameraRig from '@/components/features/CameraRig';
import CanvasBoundary from '@/components/features/CanvasBoundary';
import ViewportCapture from '@/components/features/ViewportCapture';
import RendererHealth from '@/components/features/RendererHealth';
export default function ShowroomCanvas(){const mobile=useMobileView();const visible=usePageVisible();const s=useStudio();return <div className="absolute inset-0 touch-none" aria-label="3D showroom. One finger pans; two fingers orbit and pinch to zoom. Right mouse orbits; scroll zooms."><CanvasBoundary><Canvas frameloop={visible?'always':'never'} dpr={mobile?[1,1.5]:[1,2]} shadows={s.shadows} camera={{position:[5,3.2,5],fov:39}} gl={{antialias:!mobile,alpha:true,powerPreference:'high-performance'}} onPointerMissed={()=>s.setSelectedNode(null)} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();console.warn('[Showtime] WebGL context lost');});}}><Suspense fallback={null}><StudioEnvironment mobile={mobile}/><StudioModel/><CameraRig/><ViewportCapture/><RendererHealth mobile={mobile}/></Suspense></Canvas></CanvasBoundary></div>;}
